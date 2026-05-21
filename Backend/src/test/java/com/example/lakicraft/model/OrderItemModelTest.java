package com.example.lakicraft.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.*;

@DisplayName("OrderItem Model Tests")
class OrderItemModelTest {

    @Test
    @DisplayName("Should store product, quantity, and price")
    void testOrderItemSettersAndGetters() {
        Product product = new Product();
        product.setId(50L);
        product.setName("Sample Product");

        OrderItem orderItem = new OrderItem();
        orderItem.setId(11L);
        orderItem.setProduct(product);
        orderItem.setQuantity(4);
        orderItem.setPrice(BigDecimal.valueOf(19.99));

        assertThat(orderItem.getId()).isEqualTo(11L);
        assertThat(orderItem.getProduct()).isSameAs(product);
        assertThat(orderItem.getQuantity()).isEqualTo(4);
        assertThat(orderItem.getPrice()).isEqualByComparingTo(BigDecimal.valueOf(19.99));
    }
}
