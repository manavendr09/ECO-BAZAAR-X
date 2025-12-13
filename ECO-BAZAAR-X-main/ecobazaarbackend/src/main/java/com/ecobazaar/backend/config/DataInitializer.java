package com.ecobazaar.backend.config;

import com.ecobazaar.backend.entity.Category;
import com.ecobazaar.backend.entity.Product;
import com.ecobazaar.backend.entity.Role;
import com.ecobazaar.backend.entity.User;
import com.ecobazaar.backend.repository.CategoryRepository;
import com.ecobazaar.backend.repository.ProductRepository;
import com.ecobazaar.backend.repository.UserRepository;
import com.ecobazaar.backend.service.CarbonCalculatorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CarbonCalculatorService carbonCalculatorService;

    @Override
    public void run(String... args) throws Exception {
        // Initialize categories
        initializeCategories();
        
        // Initialize seller user
        User seller = initializeSeller();
        
        // Initialize products
        initializeProducts(seller);
    }

    private void initializeCategories() {
        if (categoryRepository.count() == 0) {
            List<Category> categories = Arrays.asList(
                createCategory("Electronics", "Electronic devices and gadgets"),
                createCategory("Fashion", "Clothing and fashion items"),
                createCategory("Home & Garden", "Home improvement and gardening products"),
                createCategory("Office", "Office supplies and stationery"),
                createCategory("Personal Care", "Natural and organic personal care products"),
                createCategory("Food & Beverages", "Organic and sustainable food products")
            );
            categoryRepository.saveAll(categories);
            System.out.println("Initialized " + categories.size() + " categories");
        }
    }

    private Category createCategory(String name, String description) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setIsActive(true);
        return category;
    }

    private User initializeSeller() {
        User seller = userRepository.findByUsername("testseller").orElse(null);
        if (seller == null) {
            seller = new User();
            seller.setUsername("testseller");
            seller.setEmail("seller@ecobazaar.com");
            seller.setPassword("password123"); // Plain text as per your PasswordEncoder
            seller.setFirstName("Test");
            seller.setLastName("Seller");
            seller.setRole(Role.SELLER);
            seller.setIsActive(true);
            seller.setEcoPoints(0);
            seller = userRepository.save(seller);
            System.out.println("Created test seller user: " + seller.getUsername());
        }
        return seller;
    }

    private void initializeProducts(User seller) {
        if (productRepository.count() == 0) {
            List<Category> categories = categoryRepository.findAll();
            Category electronics = categories.stream()
                .filter(c -> c.getName().equals("Electronics"))
                .findFirst()
                .orElse(categories.get(0));
            Category fashion = categories.stream()
                .filter(c -> c.getName().equals("Fashion"))
                .findFirst()
                .orElse(categories.get(0));
            Category home = categories.stream()
                .filter(c -> c.getName().equals("Home & Garden"))
                .findFirst()
                .orElse(categories.get(0));
            Category office = categories.stream()
                .filter(c -> c.getName().equals("Office"))
                .findFirst()
                .orElse(categories.get(0));
            Category personalCare = categories.stream()
                .filter(c -> c.getName().equals("Personal Care"))
                .findFirst()
                .orElse(categories.get(0));

            List<Product> products = Arrays.asList(
                createProduct("Organic Cotton T-Shirt", 
                    "Premium organic cotton t-shirt made from 100% certified organic cotton. Comfortable, breathable, and eco-friendly.",
                    new BigDecimal("29.99"), fashion, seller, new BigDecimal("0.2"), new BigDecimal("50"), true,
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop"),
                createProduct("Bamboo Water Bottle",
                    "Sustainable bamboo water bottle with stainless steel interior. Keeps drinks cold for 24 hours and hot for 12 hours.",
                    new BigDecimal("24.99"), home, seller, new BigDecimal("0.5"), new BigDecimal("30"), true,
                    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop"),
                createProduct("Solar Power Bank",
                    "Portable solar charger with 20,000mAh capacity. Perfect for outdoor adventures and emergency charging.",
                    new BigDecimal("49.99"), electronics, seller, new BigDecimal("0.3"), new BigDecimal("100"), true,
                    "https://images.unsplash.com/photo-1609592806598-ef155b6f4b0c?w=400&h=400&fit=crop"),
                createProduct("Recycled Paper Notebook",
                    "Premium notebook made from 100% recycled paper. Perfect for eco-conscious students and professionals.",
                    new BigDecimal("12.99"), office, seller, new BigDecimal("0.1"), new BigDecimal("25"), true,
                    "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=400&h=400&fit=crop"),
                createProduct("Bamboo Toothbrush Set",
                    "Set of 4 biodegradable bamboo toothbrushes with soft bristles. Eco-friendly alternative to plastic toothbrushes.",
                    new BigDecimal("8.99"), personalCare, seller, new BigDecimal("0.05"), new BigDecimal("20"), true,
                    "https://images.unsplash.com/photo-1559591935-c7cc5c248ce1?w=400&h=400&fit=crop"),
                createProduct("Hemp Backpack",
                    "Durable hemp backpack with laptop compartment. Water-resistant and perfect for daily use or travel.",
                    new BigDecimal("39.99"), fashion, seller, new BigDecimal("0.8"), new BigDecimal("60"), true,
                    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"),
                createProduct("LED Grow Light",
                    "Energy-efficient LED grow light for indoor plants. Promotes healthy growth with full spectrum lighting.",
                    new BigDecimal("34.99"), home, seller, new BigDecimal("0.4"), new BigDecimal("40"), true,
                    "https://images.unsplash.com/photo-1609592806598-ef155b6f4b0c?w=400&h=400&fit=crop"),
                createProduct("Recycled Glass Vase",
                    "Beautiful vase made from 100% recycled glass. Perfect for flowers or as a decorative piece.",
                    new BigDecimal("19.99"), home, seller, new BigDecimal("0.6"), new BigDecimal("35"), true,
                    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop")
            );

            productRepository.saveAll(products);
            System.out.println("Initialized " + products.size() + " products");
        }
    }

    private Product createProduct(String name, String description, BigDecimal price, 
                                 Category category, User seller, BigDecimal weight, 
                                 BigDecimal shippingDistance, Boolean isEcoFriendly, String imageUrl) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setCategory(category);
        product.setSeller(seller);
        product.setWeightKg(weight);
        product.setShippingDistanceKm(shippingDistance);
        product.setIsEcoFriendly(isEcoFriendly);
        product.setStockQuantity(50);
        product.setIsActive(true);
        product.setImageUrl(imageUrl);
        
        // Calculate carbon score
        BigDecimal carbonScore = carbonCalculatorService.calculateCarbonScore(
            weight, shippingDistance, isEcoFriendly
        );
        product.setCarbonScore(carbonScore);
        
        return product;
    }
}

