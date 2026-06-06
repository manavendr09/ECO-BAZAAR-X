package com.ecobazaarx.smart_cart_backend.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponseDTO {
    private Long orderId;
    private String status;
    private BigDecimal totalAmount;
    private List<OrderItemDTO> items;  // or List<OrderItemDTO> if you convert
    private LocalDateTime createdAt;
    private double totalEmission;   // optional field

    // Constructor that matches your current usage
    public OrderResponseDTO(Long orderId, String status, BigDecimal totalAmount, 
                           List<OrderItemDTO> items, LocalDateTime createdAt) {
        this.orderId = orderId;
        this.status = status;
        this.totalAmount = totalAmount;
        this.items = items;
        this.createdAt = createdAt;
        this.totalEmission = 0.0; // default value
    }

    // Alternative constructor with all fields
    public OrderResponseDTO(Long orderId, String status, BigDecimal totalAmount,
                           List<OrderItemDTO> items, LocalDateTime createdAt, double totalEmission) {
        this.orderId = orderId;
        this.status = status;
        this.totalAmount = totalAmount;
        this.items = items;
        this.createdAt = createdAt;
        this.totalEmission = totalEmission;
    }

    // Getters and setters...
    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public List<OrderItemDTO> getItems() { return items; }
    public void setItems(List<OrderItemDTO> items) { this.items = items; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public double getTotalEmission() { return totalEmission; }
    public void setTotalEmission(double totalEmission) { this.totalEmission = totalEmission; }
}