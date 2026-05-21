package com.example.lakicraft.repository;

import com.example.lakicraft.model.Product;
import com.example.lakicraft.model.Sale;
import com.example.lakicraft.model.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
@DisplayName("SaleRepository Integration Tests")
class SaleRepositoryTest {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Should calculate total sales for a user")
    void testGetTotalSalesByUserId() {
        User user = new User();
        user.setEmail("sales-user@example.com");
        user = userRepository.save(user);

        Product product = new Product();
        product.setName("SaleProduct");
        product.setKod("SP100");
        product.setStock(5);
        product.setPrice(24.99);
        product.setBrand("SaleBrand");
        product.setPackaging(25.0);
        product.setUser(user);
        product = productRepository.save(product);

        Sale sale = new Sale(user.getId().longValue(), product, new BigDecimal("2"), new BigDecimal("49.98"), LocalDateTime.now());
        saleRepository.save(sale);

        BigDecimal totalSales = saleRepository.getTotalSalesByUserId(user.getId().longValue());

        assertThat(totalSales).isEqualByComparingTo(new BigDecimal("2"));
    }

    @Test
    @DisplayName("Should calculate total revenue")
    void testGetTotalSales() {
        User user = new User();
        user.setEmail("revenue-user@example.com");
        user = userRepository.save(user);

        Product product = new Product();
        product.setName("RevenueProduct");
        product.setKod("RP200");
        product.setStock(10);
        product.setPrice(49.99);
        product.setBrand("RevenueBrand");
        product.setPackaging(10.0);
        product.setUser(user);
        product = productRepository.save(product);

        Sale sale = new Sale(user.getId().longValue(), product, new BigDecimal("1"), new BigDecimal("49.99"), LocalDateTime.now());
        saleRepository.save(sale);

        BigDecimal totalRevenue = saleRepository.getTotalSales();

        assertThat(totalRevenue).isEqualByComparingTo(new BigDecimal("49.99"));
    }
}
