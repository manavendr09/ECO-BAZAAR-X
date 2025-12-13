package com.ecobazaarx.smart_cart_backend.service;

import org.springframework.stereotype.Service;

import com.ecobazaarx.smart_cart_backend.entity.User;
import com.ecobazaarx.smart_cart_backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Register user
    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        return userRepository.save(user);
    }

    // Login user
    public User login(String email) {
        User user = userRepository.findByEmail(email);

        if (user == null)
            throw new RuntimeException("Invalid Email");

        return user;
    }
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public boolean authenticate(String email, String password) {
        // Find user by email
        User user = userRepository.findByEmail(email);

        // If user not found → false
        if (user == null) {
            return false;
        }

        // Compare passwords (plain-text for now; demo only)
        return user.getPassword().equals(password);
    }


}
