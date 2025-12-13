package com.ecobazaarx.smart_cart_backend.service;

import org.springframework.stereotype.Service;

import com.ecobazaarx.smart_cart_backend.entity.CartItem;
import com.ecobazaarx.smart_cart_backend.entity.Product;
import com.ecobazaarx.smart_cart_backend.entity.User;
import com.ecobazaarx.smart_cart_backend.repository.CartItemRepository;
import com.ecobazaarx.smart_cart_backend.repository.ProductRepository;
import com.ecobazaarx.smart_cart_backend.repository.UserRepository;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public CartItem addToCart(Long userId, Long productId, int qty) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = CartItem.builder()
                .user(user)
                .product(product)
                .quantity(qty)
                .itemEmission(product.getEmissionPerUnit() * qty)
                .itemTotalPrice(product.getPrice().doubleValue() * qty)
                .build();

        return cartItemRepository.save(item);
    }

    // Get user cart
    public List<CartItem> getCartItems(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    // Update quantity
    public CartItem updateQuantity(Long cartItemId, int qty) {
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        item.setQuantity(qty);
        item.setItemEmission(item.getProduct().getEmissionPerUnit() * qty);
        item.setItemTotalPrice(item.getProduct().getPrice().doubleValue() * qty);

        return cartItemRepository.save(item);
    }

    // Remove
    public void removeItem(Long id) {
        cartItemRepository.deleteById(id);
    }

    // Calculate total price for a user
    public BigDecimal getTotalPrice(Long userId) {
        return cartItemRepository.findByUserId(userId)
                .stream()
                .map(i -> i.getProduct().getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // Calculate emission
    public double getTotalEmission(Long userId) {
        return cartItemRepository.findByUserId(userId)
                .stream()
                .mapToDouble(i -> i.getProduct().getEmissionPerUnit() * i.getQuantity())
                .sum();
    }


 // Clear cart for a user
    public void clearCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        cartItemRepository.deleteAll(items);
    }

}
