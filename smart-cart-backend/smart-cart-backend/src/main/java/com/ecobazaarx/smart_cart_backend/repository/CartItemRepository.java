package com.ecobazaarx.smart_cart_backend.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecobazaarx.smart_cart_backend.entity.CartItem;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

	CartItem findByUserIdAndProductId(Long userId, Long productId);
	List<CartItem> findByUserId(Long userId);
	

}
