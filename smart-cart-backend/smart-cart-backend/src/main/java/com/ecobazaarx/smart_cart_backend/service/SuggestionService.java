package com.ecobazaarx.smart_cart_backend.service;

import com.ecobazaarx.smart_cart_backend.entity.Product;

public interface SuggestionService {
    String getSuggestion(String productName);
    Product suggestGreenerAlternative(Product product);
}
