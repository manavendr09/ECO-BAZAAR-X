// package com.ecobazaar.backend.service;

// import com.ecobazaar.backend.dto.LoginRequest;
// import com.ecobazaar.backend.dto.LoginResponse;
// import com.ecobazaar.backend.dto.RegisterRequest;
// import com.ecobazaar.backend.entity.User;
// import com.ecobazaar.backend.entity.Role;
// import com.ecobazaar.backend.repository.UserRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.stereotype.Service;

// @Service
// public class AuthService {
    
//     @Autowired
//     private UserRepository userRepository;
    
//     // Password encoder removed for plain text passwords
    
//     @Autowired
//     private JwtService jwtService;
    
//     @Autowired
//     private AuthenticationManager authenticationManager;
//     public LoginResponse login(LoginRequest request) {
//         // First check if user exists
//         User user = userRepository.findByUsername(request.getUsername())
//             .orElseThrow(() -> new RuntimeException("Invalid credentials. Please check your username and password."));
        
//         // Check if user is blocked before authentication
//         if (!user.getIsActive()) {
//             if (user.getRole() == Role.SELLER) {
//                 throw new RuntimeException("Your seller account has been blocked due to policy violations or selling non-compliant products. Please contact support for assistance.");
//             } else {
//                 throw new RuntimeException("Your account has been blocked. Please contact support for assistance.");
//             }
//         }
        
//         // Delegate authentication to AuthenticationManager so the injected field is used
//         try {
//             authenticationManager.authenticate(
//                 new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
//             );
//         } catch (Exception ex) {
//             throw new RuntimeException("Invalid credentials. Please check your username and password.");
//         }
        
//         // If seller is not approved yet
//         if (user.getRole() == Role.SELLER && !user.getIsActive()) {
//             throw new RuntimeException("Your seller application is still pending approval. Please wait for admin approval.");
//         }
        
//         String token = jwtService.generateToken(user.getUsername());
        
//         LoginResponse response = new LoginResponse();
//         response.setToken(token);
//         response.setUsername(user.getUsername());
//         response.setRole(user.getRole().name());
//         response.setMessage("Login successful");
//         response.setUserId(user.getId());
//         response.setFirstName(user.getFirstName());
//         response.setLastName(user.getLastName());
//         response.setEmail(user.getEmail());
        
//         return response;
//     }
    
//     public LoginResponse register(RegisterRequest request) {
//         if (userRepository.existsByUsername(request.getUsername())) {
//             throw new RuntimeException("Username already exists");
//         }
        
//         if (userRepository.existsByEmail(request.getEmail())) {
//             throw new RuntimeException("Email already exists");
//         }
        
//         User user = new User();
//         user.setUsername(request.getUsername());
//         user.setEmail(request.getEmail());
//         user.setPassword(request.getPassword()); // Store password as plain text
//         user.setFirstName(request.getFirstName());
//         user.setLastName(request.getLastName());
//         user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        
//         userRepository.save(user);
        
//         String token = jwtService.generateToken(user.getUsername());
        
//         LoginResponse response = new LoginResponse();
//         response.setToken(token);
//         response.setUsername(user.getUsername());
//         response.setRole(user.getRole().name());
//         response.setMessage("Registration successful");
        
//         return response;
//     }
// }


package com.ecobazaar.backend.service;

import com.ecobazaar.backend.dto.LoginRequest;
import com.ecobazaar.backend.dto.LoginResponse;
import com.ecobazaar.backend.dto.RegisterRequest;
import com.ecobazaar.backend.entity.Role;
import com.ecobazaar.backend.entity.User;
import com.ecobazaar.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmailService emailService;

    /* ---------------- LOGIN ---------------- */

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!user.getIsActive()) {
            throw new RuntimeException("Your account is blocked. Please contact support.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        String token = jwtService.generateToken(user.getUsername());

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUsername(user.getUsername());
        response.setRole(user.getRole().name());
        response.setUserId(user.getId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setEmail(user.getEmail());
        response.setMessage("Login successful");

        return response;
    }

    /* ---------------- REGISTER ---------------- */

    public LoginResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // plain text (as per your setup)
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        user.setIsActive(true);

        userRepository.save(user);

        String token = jwtService.generateToken(user.getUsername());

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUsername(user.getUsername());
        response.setRole(user.getRole().name());
        response.setMessage("Registration successful");

        return response;
    }

    /* ---------------- FORGOT PASSWORD ---------------- */

    public void forgotPassword(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not registered"));

        String otp = generateOtp();

        user.setResetOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));

        userRepository.save(user);

        emailService.sendOtpEmail(email, otp);
    }

    /* ---------------- RESET PASSWORD ---------------- */

    public void resetPassword(String email, String otp, String newPassword) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (user.getResetOtp() == null ||
                !user.getResetOtp().equals(otp) ||
                user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        user.setPassword(newPassword); // plain text (consistent with your app)
        user.setResetOtp(null);
        user.setOtpExpiry(null);

        userRepository.save(user);
    }

    /* ---------------- OTP GENERATOR ---------------- */

    private String generateOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }
}
