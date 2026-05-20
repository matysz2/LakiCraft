package com.example.lakicraft.model;

import com.example.lakicraft.BaseUnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Product Model Tests")
class ProductTest extends BaseUnitTest {

    private Product product;

    @BeforeEach
    void setUp() {
        product = new Product();
    }

    @Test
    @DisplayName("Should create product with all fields")
    void testCreateProduct() {
        // Arrange & Act
        product.setId(1L);
        product.setName("Premium Lakier");
        product.setKod("LAK-001");
        product.setStock(10);
        product.setPrice(199.99);
        product.setBrand("LakiBrand");
        product.setPackaging(100.0);
        product.setImagePath("/images/product1.jpg");
        product.setStatus("active");

        // Assert
        assertThat(product.getId()).isEqualTo(1L);
        assertThat(product.getName()).isEqualTo("Premium Lakier");
        assertThat(product.getKod()).isEqualTo("LAK-001");
        assertThat(product.getStock()).isEqualTo(10);
        assertThat(product.getPrice()).isEqualTo(199.99);
        assertThat(product.getBrand()).isEqualTo("LakiBrand");
        assertThat(product.getPackaging()).isEqualTo(100.0);
        assertThat(product.getImagePath()).isEqualTo("/images/product1.jpg");
        assertThat(product.getStatus()).isEqualTo("active");
    }

    @Test
    @DisplayName("Should have default status as active")
    void testDefaultStatus() {
        // Assert
        assertThat(product.getStatus()).isEqualTo("active");
    }

    @Test
    @DisplayName("Should update product price")
    void testUpdatePrice() {
        // Arrange
        Double initialPrice = 99.99;
        Double newPrice = 149.99;

        product.setPrice(initialPrice);
        assertThat(product.getPrice()).isEqualTo(initialPrice);

        // Act
        product.setPrice(newPrice);

        // Assert
        assertThat(product.getPrice()).isEqualTo(newPrice);
    }

    @Test
    @DisplayName("Should update product stock")
    void testUpdateStock() {
        // Arrange
        Integer initialStock = 50;
        Integer reducedStock = 45;

        product.setStock(initialStock);
        assertThat(product.getStock()).isEqualTo(initialStock);

        // Act
        product.setStock(reducedStock);

        // Assert
        assertThat(product.getStock()).isEqualTo(reducedStock);
    }

    @Test
    @DisplayName("Should set and get brand")
    void testBrand() {
        // Act
        product.setBrand("Premium Brand");

        // Assert
        assertThat(product.getBrand()).isEqualTo("Premium Brand");
    }

    @Test
    @DisplayName("Should set product as inactive")
    void testInactiveStatus() {
        // Act
        product.setStatus("inactive");

        // Assert
        assertThat(product.getStatus()).isEqualTo("inactive");
    }

    @Test
    @DisplayName("Should handle null values")
    void testNullValues() {
        // Act
        product.setName(null);
        product.setImagePath(null);
        product.setBrand(null);

        // Assert
        assertThat(product.getName()).isNull();
        assertThat(product.getImagePath()).isNull();
        assertThat(product.getBrand()).isNull();
    }

    @Test
    @DisplayName("Should handle zero price")
    void testZeroPrice() {
        // Act
        product.setPrice(0.0);

        // Assert
        assertThat(product.getPrice()).isEqualTo(0.0);
    }

    @Test
    @DisplayName("Should handle zero stock")
    void testZeroStock() {
        // Act
        product.setStock(0);

        // Assert
        assertThat(product.getStock()).isEqualTo(0);
    }

    @Test
    @DisplayName("Should handle negative price (edge case)")
    void testNegativePrice() {
        // Act
        product.setPrice(-50.0);

        // Assert
        assertThat(product.getPrice()).isEqualTo(-50.0);
        // Note: In production, validation should prevent this
    }

    @Test
    @DisplayName("Should handle large packaging value")
    void testLargePackagingValue() {
        // Act
        product.setPackaging(99999.99);

        // Assert
        assertThat(product.getPackaging()).isEqualTo(99999.99);
    }

    @Test
    @DisplayName("Should create two different products with different ids")
    void testProductEquality() {
        // Arrange
        Product product1 = new Product();
        product1.setId(1L);
        product1.setName("Lakier 1");

        Product product2 = new Product();
        product2.setId(2L);
        product2.setName("Lakier 2");

        // Assert
        assertThat(product1.getId()).isNotEqualTo(product2.getId());
        assertThat(product1.getName()).isNotEqualTo(product2.getName());
    }
}
