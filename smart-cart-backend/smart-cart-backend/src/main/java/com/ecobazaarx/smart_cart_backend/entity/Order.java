package com.ecobazaarx.smart_cart_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id")
    private List<CartItem> items;

    private double totalPrice;
    private double totalEmission;

    private LocalDateTime orderDate = LocalDateTime.now();

    private String status;           // CONFIRMED, SHIPPED, DELIVERED
    private String paymentMethod;    // COD, UPI, CARD
    private String paymentStatus;    // PENDING, PAID

    private String transactionId;    // For online payment
    private String orderTrackingId;  // TRK-xxxxxx
	
	public String getCustomerName() {
	    return user != null ? user.getName() : "Valued Customer";
	}

	public String getCustomerEmail() {
	    return user != null ? user.getEmail() : "";
	}
	public String getShippingAddress() {
	    return user != null ? user.getAddress() : "Address not provided";
	}


}
