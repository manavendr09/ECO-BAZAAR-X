package com.ecobazaarx.smart_cart_backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecobazaarx.smart_cart_backend.entity.Product;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Search by name
    List<Product> findByNameContainingIgnoreCase(String name);

    // Filter by category
    List<Product> findByCategory(String category);

    // Green products filter
    List<Product> findByIsGreen(boolean isGreen);

    // Products under specific price
    List<Product> findByPriceLessThan(double price);
    
    List<Product> findByIsGreenTrueAndEmissionPerUnitLessThan(double emission);

}
