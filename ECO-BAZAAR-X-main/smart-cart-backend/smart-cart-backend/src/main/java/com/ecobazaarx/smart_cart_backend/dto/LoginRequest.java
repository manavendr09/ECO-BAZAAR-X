package com.ecobazaarx.smart_cart_backend.dto;

public class LoginRequest {
    private String email;
    private String password;
    // getters and setters (or use Lombok: @Data)
    public LoginRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
