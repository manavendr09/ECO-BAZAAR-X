package com.ecobazaarx.smart_cart_backend.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecobazaarx.smart_cart_backend.entity.Product;
import com.ecobazaarx.smart_cart_backend.exception.ResourceNotFoundException;
import com.ecobazaarx.smart_cart_backend.repository.ProductRepository;
import com.ecobazaarx.smart_cart_backend.service.SuggestionService;

@RestController
@RequestMapping("/api/suggestions")
public class SuggestionController {

    private final SuggestionService suggestionService;
    private final ProductRepository productRepository;

    public SuggestionController(SuggestionService suggestionService, ProductRepository productRepository) {
        this.suggestionService = suggestionService;
        this.productRepository = productRepository;
    }
    @GetMapping("/product/{id}")
    public ResponseEntity<Product> suggestForProduct(@PathVariable Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));
        Product alt = suggestionService.suggestGreenerAlternative(p);
        if (alt == null) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(alt);
    }

}
