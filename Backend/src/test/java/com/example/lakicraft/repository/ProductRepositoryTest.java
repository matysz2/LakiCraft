package com.example.lakicraft.repository;

import com.example.lakicraft.model.Product;
import com.example.lakicraft.model.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
@DisplayName("ProductRepository Integration Tests")
class ProductRepositoryTest {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Should find products by user")
    void testFindByUser() {
        User user = new User();
        user.setEmail("product-user@example.com");
        user = userRepository.save(user);

        Product product = new Product();
        product.setName("Test Product");
        product.setKod("TP100");
        product.setStock(5);
        product.setPrice(49.99);
        product.setBrand("TestBrand");
        product.setPackaging(100.0);
        product.setUser(user);
        productRepository.save(product);

        List<Product> products = productRepository.findByUser(user);

        assertThat(products).hasSize(1);
        assertThat(products.get(0).getName()).isEqualTo("Test Product");
    }

    @Test
    @DisplayName("Should find products by userId and brand")
    void testFindByUserIdAndBrand() {
        User user = new User();
        user.setEmail("brand-user@example.com");
        user = userRepository.save(user);

        Product product = new Product();
        product.setName("BrandProduct");
        product.setKod("BP200");
        product.setStock(3);
        product.setPrice(79.99);
        product.setBrand("BrandX");
        product.setPackaging(50.0);
        product.setUser(user);
        productRepository.save(product);

        List<Product> products = productRepository.findByUserIdAndBrand(user.getId().longValue(), "BrandX");

        assertThat(products).hasSize(1);
        assertThat(products.get(0).getBrand()).isEqualTo("BrandX");
    }
}
