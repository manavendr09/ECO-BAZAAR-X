package com.ecobazaarx.smart_cart_backend.Controllers;

import com.ecobazaarx.smart_cart_backend.entity.User;
import com.ecobazaarx.smart_cart_backend.exception.InvalidRequestException;
import com.ecobazaarx.smart_cart_backend.exception.ValidationException;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import com.ecobazaarx.smart_cart_backend.dto.LoginRequest;
import com.ecobazaarx.smart_cart_backend.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        boolean ok = userService.authenticate(request.getEmail(), request.getPassword());
        if (!ok) throw new InvalidRequestException("Invalid email or password");
        // For now return a simple message; frontend can be adapted later
        return ResponseEntity.ok("Login successful for " + request.getEmail());
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@Validated @RequestBody User user) {
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            throw new ValidationException("Email is required");
        }
        User saved = userService.registerUser(user);
        return ResponseEntity.ok(saved);
    }

    // Fetch user by ID (used by frontend for profile / orders)
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
}
