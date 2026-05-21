package com.example.lakicraft.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Sale Model Tests")
class SaleModelTest {

    @Test
    @DisplayName("Should create Sale using constructor and preserve values")
    void testSaleConstructorAndGetters() {
        Product product = new Product();
        product.setId(10L);
        product.setName("Example Product");

        LocalDateTime saleDate = LocalDateTime.of(2026, 5, 21, 12, 0);
        Sale sale = new Sale(42L, product, BigDecimal.valueOf(3), BigDecimal.valueOf(99.99), saleDate);

        assertThat(sale.getUserId()).isEqualTo(42L);
        assertThat(sale.getProduct()).isSameAs(product);
        assertThat(sale.getAmount()).isEqualByComparingTo(BigDecimal.valueOf(3));
        assertThat(sale.getTotalPrice()).isEqualByComparingTo(BigDecimal.valueOf(99.99));
        assertThat(sale.getSaleDate()).isEqualTo(saleDate);
    }

    @Test
    @DisplayName("Should allow updating sale fields")
    void testSaleSetters() {
        Sale sale = new Sale();
        sale.setUserId(7L);
        sale.setAmount(BigDecimal.valueOf(5));
        sale.setTotalPrice(BigDecimal.valueOf(250.50));
        sale.setSaleDate(LocalDateTime.now());

        assertThat(sale.getUserId()).isEqualTo(7L);
        assertThat(sale.getAmount()).isEqualByComparingTo(BigDecimal.valueOf(5));
        assertThat(sale.getTotalPrice()).isEqualByComparingTo(BigDecimal.valueOf(250.50));
        assertThat(sale.getSaleDate()).isNotNull();
    }
}
