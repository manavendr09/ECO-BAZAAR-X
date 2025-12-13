package com.ecobazaarx.smart_cart_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password; // (optional) only if auth needed

    // Address fields (real e-commerce)
    private String address;
    private String city;
    private String state;
    private String pincode;

    private String phone;

    // User type (Admin / Customer)
    private String role = "CUSTOMER";
}
