package com.ecobazaarx.smart_cart_backend.entity;

import jakarta.persistence.*;

import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private BigDecimal price;

    // CO₂ emission per unit (kg)
    private double emissionPerUnit;

    // Green alternative flag
    private boolean isGreen;

    // Extra fields for real project
    private String description;
    private String category;
    private String brand;

    private String imageUrl;   // to show product image
    private boolean inStock = true;
}
