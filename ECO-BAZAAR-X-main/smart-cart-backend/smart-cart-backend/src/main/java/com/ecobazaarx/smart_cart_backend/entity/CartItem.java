package com.ecobazaarx.smart_cart_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Many cart items → One product
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;


    // Extra real-world fields
    private double itemEmission;   // (product.emissionPerUnit * quantity)
    private double itemTotalPrice; // (product.price * quantity)
}
