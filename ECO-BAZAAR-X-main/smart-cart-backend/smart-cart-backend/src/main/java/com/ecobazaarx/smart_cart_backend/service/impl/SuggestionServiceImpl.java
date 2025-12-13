package com.ecobazaarx.smart_cart_backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import com.ecobazaarx.smart_cart_backend.entity.Product;
import com.ecobazaarx.smart_cart_backend.repository.ProductRepository;
import com.ecobazaarx.smart_cart_backend.service.SuggestionService;

@Service
public class SuggestionServiceImpl implements SuggestionService {

    private final ProductRepository productRepository;

    public SuggestionServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public String getSuggestion(String productName) {
        return "This is eco-friendly suggestion for: " + productName;
    }

    @Override
    public Product suggestGreenerAlternative(Product product) {

        List<Product> alternatives = productRepository
                .findByIsGreenTrueAndEmissionPerUnitLessThan(product.getEmissionPerUnit());

        if (alternatives.isEmpty()) return null;

        // सर्वात कमी emission असलेले product देतो
        return alternatives.stream()
                .sorted((a, b) -> Double.compare(a.getEmissionPerUnit(), b.getEmissionPerUnit()))
                .findFirst()
                .orElse(null);
    }
}
