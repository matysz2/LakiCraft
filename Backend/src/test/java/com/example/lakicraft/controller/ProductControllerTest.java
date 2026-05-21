package com.example.lakicraft.controller;

import com.example.lakicraft.model.Product;
import com.example.lakicraft.model.User;
import com.example.lakicraft.repository.ProductRepository;
import com.example.lakicraft.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductController Unit Tests")
class ProductControllerTest {

    @InjectMocks
    private ProductController productController;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        // InjectMocks handles injection
    }

    @Test
    @DisplayName("Should return product by ID when found")
    void testGetProductById_Found() {
        Product product = new Product();
        product.setId(1L);
        product.setName("Test Product");

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ResponseEntity<Product> response = productController.getProductById(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(product);
    }

    @Test
    @DisplayName("Should return not found when updating product with missing user")
    void testUpdateProduct_UserNotFound() {
        Product requestProduct = new Product();
        requestProduct.setName("Updated Name");

        when(productRepository.findById(1L)).thenReturn(Optional.of(new Product()));
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        ResponseEntity<Product> response = productController.updateProduct(1L, requestProduct, 99L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNull();
    }
}
