package com.ecobazaarx.smart_cart_backend.dto;

import lombok.Data;

@Data
public class OrderRequestDTO {
    private Long userId;
    private String paymentMethod;
}
