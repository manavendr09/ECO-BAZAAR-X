package com.ecobazaarx.smart_cart_backend.service;


import org.springframework.stereotype.Service;

import com.ecobazaarx.smart_cart_backend.entity.Product;
import com.ecobazaarx.smart_cart_backend.repository.ProductRepository;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Add new product
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Get product by id
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    // Search by name
    public List<Product> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    // Filter by category
    public List<Product> filterByCategory(String category) {
        return productRepository.findByCategory(category);
    }

    // Get greener alternative products
    public List<Product> getGreenerAlternatives() {
        return productRepository.findByIsGreen(true);
    }

    public boolean deleteProduct(Long id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) return false;
        productRepository.delete(product);
        return true;
    }

}
