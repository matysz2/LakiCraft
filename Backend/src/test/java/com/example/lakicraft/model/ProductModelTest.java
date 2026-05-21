package com.example.lakicraft.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Product Model Tests")
class ProductModelTest {

    @Test
    @DisplayName("Should store and retrieve product properties")
    void testProductSettersAndGetters() {
        Product product = new Product();
        product.setId(123L);
        product.setName("Lakier premium");
        product.setKod("LK100");
        product.setStock(20);
        product.setPrice(199.99);
        product.setBrand("LakiBrand");
        product.setPackaging(250.0);
        product.setImagePath("/images/lakier.jpg");
        product.setStatus("active");

        assertThat(product.getId()).isEqualTo(123L);
        assertThat(product.getName()).isEqualTo("Lakier premium");
        assertThat(product.getKod()).isEqualTo("LK100");
        assertThat(product.getStock()).isEqualTo(20);
        assertThat(product.getPrice()).isEqualTo(199.99);
        assertThat(product.getBrand()).isEqualTo("LakiBrand");
        assertThat(product.getPackaging()).isEqualTo(250.0);
        assertThat(product.getImagePath()).isEqualTo("/images/lakier.jpg");
        assertThat(product.getStatus()).isEqualTo("active");
    }
}
