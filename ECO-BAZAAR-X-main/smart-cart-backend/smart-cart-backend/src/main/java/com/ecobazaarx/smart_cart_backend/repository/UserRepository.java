package com.ecobazaarx.smart_cart_backend.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecobazaarx.smart_cart_backend.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // For login / validation
    User findByEmail(String email);

    boolean existsByEmail(String email);
}
