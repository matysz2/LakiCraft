package com.example.lakicraft.controller;

import com.example.lakicraft.BaseIntegrationTest;
import com.example.lakicraft.model.Product;
import com.example.lakicraft.model.User;
import com.example.lakicraft.repository.ProductRepository;
import com.example.lakicraft.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@DisplayName("ProductController Integration Tests")
class ProductControllerIT extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        productRepository.deleteAll();
        userRepository.deleteAll();

        // Create test user
        testUser = new User();
        testUser.setEmail("test@example.com");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser = userRepository.save(testUser);
    }

    private Product createTestProduct(String name, String brand, Double price) {
        Product product = new Product();
        product.setName(name);
        product.setBrand(brand);
        product.setPrice(price);
        product.setStock(10);
        product.setKod("TEST-" + System.currentTimeMillis());
        product.setImagePath("/images/test.jpg");
        product.setUser(testUser);
        product.setStatus("active");
        return productRepository.save(product);
    }

    @Test
    @DisplayName("Should get product by id")
    void testGetProductById_Success() throws Exception {
        // Arrange
        Product product = createTestProduct("Lakier Premium", "Premium", 199.99);

        // Act & Assert
        mockMvc.perform(get("/api/products/{id}", product.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", equalTo(product.getId().intValue())))
                .andExpect(jsonPath("$.name", equalTo("Lakier Premium")))
                .andExpect(jsonPath("$.price", equalTo(199.99)));
    }

    @Test
    @DisplayName("Should return 404 when product not found")
    void testGetProductById_NotFound() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/products/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should get products by user id")
    void testGetProductsByUserId_Success() throws Exception {
        // Arrange
        createTestProduct("Lakier 1", "Premium", 99.99);
        createTestProduct("Lakier 2", "Standard", 49.99);

        // Act & Assert
        mockMvc.perform(get("/api/products")
                .header("user_id", testUser.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(2))));
    }

    @Test
    @DisplayName("Should update product successfully")
    void testUpdateProduct_Success() throws Exception {
        // Arrange
        Product product = createTestProduct("Old Name", "Standard", 99.99);

        Product updateData = new Product();
        updateData.setName("Updated Name");
        updateData.setPrice(149.99);
        updateData.setBrand("Premium");

        // Act & Assert
        mockMvc.perform(put("/api/products/{id}", product.getId())
                .header("user_id", testUser.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").exists());
    }

    @Test
    @DisplayName("Should delete product successfully")
    void testDeleteProduct_Success() throws Exception {
        // Arrange
        Product product = createTestProduct("To Delete", "Standard", 99.99);

        // Act & Assert
        mockMvc.perform(delete("/api/products/{productId}", product.getId()))
                .andExpect(status().isOk());

        // Verify product is deleted
        mockMvc.perform(get("/api/products/{id}", product.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should return not found for deleting non-existent product")
    void testDeleteProduct_NotFound() throws Exception {
        // Act & Assert
        mockMvc.perform(delete("/api/products/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should return no content when user has no products")
    void testGetProductsByUserId_NoContent() throws Exception {
        // Create another user with no products
        User anotherUser = new User();
        anotherUser.setEmail("another@example.com");
        anotherUser.setFirstName("Another");
        anotherUser.setLastName("User");
        anotherUser = userRepository.save(anotherUser);

        // Act & Assert
        mockMvc.perform(get("/api/products")
                .header("user_id", anotherUser.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }
}
