package com.ecobazaarx.smart_cart_backend.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecobazaarx.smart_cart_backend.entity.Product;
import com.ecobazaarx.smart_cart_backend.exception.ResourceNotFoundException;
import com.ecobazaarx.smart_cart_backend.service.ProductService;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Add new product
    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        Product p = productService.addProduct(product);
        return ResponseEntity.ok(p);
    }

    // Get all products
    @GetMapping
    public ResponseEntity<List<Product>> getAll() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        Product p = productService.getProductById(id);
        if (p == null) throw new ResourceNotFoundException("Product not found with id " + id);
        return ResponseEntity.ok(p);
    }

    // Search by name
    @GetMapping("/search")
    public ResponseEntity<List<Product>> search(@RequestParam String q) {
        return ResponseEntity.ok(productService.searchProducts(q));
    }

    // Filter by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> byCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.filterByCategory(category));
    }

    // Get green products
    @GetMapping("/green")
    public ResponseEntity<List<Product>> greenProducts() {
        return ResponseEntity.ok(productService.getGreenerAlternatives());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
    	boolean deleted = productService.deleteProduct(id);
    	if (!deleted) throw new ResourceNotFoundException("Product not found for deletion with id " + id);
    	return ResponseEntity.noContent().build();
    }



}
