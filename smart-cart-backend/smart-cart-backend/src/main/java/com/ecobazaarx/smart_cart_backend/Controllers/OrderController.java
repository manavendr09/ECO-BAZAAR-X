package com.ecobazaarx.smart_cart_backend.Controllers;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.ecobazaarx.smart_cart_backend.entity.Order;
import com.ecobazaarx.smart_cart_backend.entity.User;
import com.ecobazaarx.smart_cart_backend.exception.ResourceNotFoundException;
import com.ecobazaarx.smart_cart_backend.service.OrderService;
import com.ecobazaarx.smart_cart_backend.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    public OrderController(OrderService orderService, UserService userService) {
        this.orderService = orderService;
        this.userService = userService;
    }

    // Checkout and place order for a user (simplified)
    // You can pass userId (or email) and server will fetch user
    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@RequestParam Long userId,
                                          @RequestParam String paymentMethod) {
        User user = userService.getUserById(userId);
        if (user == null) throw new ResourceNotFoundException("User not found with id " + userId);
        Order order = orderService.placeOrder(user, paymentMethod);
        return ResponseEntity.ok(order);
    }


    // Get orders by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        if (user == null) throw new ResourceNotFoundException("User not found with id " + userId);
        return ResponseEntity.ok(orderService.getOrdersByUser(user));
    }
}
