package com.ecobazaarx.smart_cart_backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecobazaarx.smart_cart_backend.entity.Order;
import com.ecobazaarx.smart_cart_backend.entity.User;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Get orders of given user
    List<Order> findByUser(User user);

    // Get orders by status (PENDING, SHIPPED, etc.)
    List<Order> findByStatus(String status);
   

}
