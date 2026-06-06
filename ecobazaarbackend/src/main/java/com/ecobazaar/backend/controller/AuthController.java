package com.ecobazaar.backend.controller;

import com.ecobazaar.backend.dto.ForgotPasswordRequest;
import com.ecobazaar.backend.dto.LoginRequest;
import com.ecobazaar.backend.dto.LoginResponse;
import com.ecobazaar.backend.dto.RegisterRequest;
import com.ecobazaar.backend.dto.ResetPasswordRequest;
import com.ecobazaar.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    /* ---------- LOGIN ---------- */
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /* ---------- REGISTER ---------- */
    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    /* ---------- FORGOT PASSWORD ---------- */
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        authService.forgotPassword(request.getEmail());
        return ResponseEntity.ok("OTP sent to email");
    }

    /* ---------- RESET PASSWORD ---------- */
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        authService.resetPassword(
                request.getEmail(),
                request.getOtp(),
                request.getNewPassword()
        );

        return ResponseEntity.ok("Password reset successful");
    }
}