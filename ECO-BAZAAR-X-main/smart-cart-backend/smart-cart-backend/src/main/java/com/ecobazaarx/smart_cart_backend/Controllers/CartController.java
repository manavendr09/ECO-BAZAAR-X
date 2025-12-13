package com.ecobazaarx.smart_cart_backend.Controllers;


import com.ecobazaarx.smart_cart_backend.dto.AddToCartRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecobazaarx.smart_cart_backend.entity.CartItem;
import com.ecobazaarx.smart_cart_backend.exception.InvalidRequestException;
import com.ecobazaarx.smart_cart_backend.exception.ResourceNotFoundException;
import com.ecobazaarx.smart_cart_backend.service.CartService;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;
   
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // Add to cart
    @PostMapping("/{userId}/add")
    public ResponseEntity<?> addToCart(@PathVariable Long userId,
                                       @RequestBody AddToCartRequest request) {

        Long productId = request.getProductId();
        int qty = request.getQuantity();

        cartService.addToCart(userId, productId, qty);

        return ResponseEntity.ok("Added to cart successfully");
    }


    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItem>> getCart(@PathVariable Long userId) {
        List<CartItem> items = cartService.getCartItems(userId);
        if (items.isEmpty()) throw new ResourceNotFoundException("Cart is empty for user " + userId);
        return ResponseEntity.ok(items);
    }
    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<CartItem> updateQty(@PathVariable Long cartItemId,
                                              @RequestParam int qty) {
        if (qty <= 0) throw new InvalidRequestException("Quantity must be greater than zero");
        CartItem updated = cartService.updateQuantity(cartItemId, qty);
        if (updated == null) throw new ResourceNotFoundException("Cart item not found with id " + cartItemId);
        return ResponseEntity.ok(updated);
    }

    // Remove
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<Void> delete(@PathVariable Long cartItemId) {
        cartService.removeItem(cartItemId);
        return ResponseEntity.noContent().build();
    }

    // Summary
    @GetMapping("/summary/{userId}")
    public ResponseEntity<CartSummary> summary(@PathVariable Long userId) {
        return ResponseEntity.ok(
                new CartSummary(
                        cartService.getTotalPrice(userId),
                        cartService.getTotalEmission(userId)
                )
        );
    }

    record CartSummary(BigDecimal subtotal, double emission) {}
}
