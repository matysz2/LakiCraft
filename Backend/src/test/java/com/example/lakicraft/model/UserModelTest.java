package com.example.lakicraft.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;

@DisplayName("User Model Tests")
class UserModelTest {

    @Test
    @DisplayName("Should set and get user details")
    void testUserFieldAccessors() {
        User user = new User();
        user.setName("Test Name");
        user.setEmail("user-model@example.com");
        user.setPassword("secret");
        user.setRole("USER");
        user.setAccountStatus("active");
        user.setFirstName("First");
        user.setLastName("Last");
        user.setShippingAddress("Test Address");
        user.setCreatedAt(LocalDateTime.of(2025, 12, 1, 10, 30));
        user.setUpdatedAt(LocalDateTime.of(2025, 12, 1, 11, 0));
        user.setPaymentDueDays(14);

        assertThat(user.getName()).isEqualTo("Test Name");
        assertThat(user.getEmail()).isEqualTo("user-model@example.com");
        assertThat(user.getPassword()).isEqualTo("secret");
        assertThat(user.getRole()).isEqualTo("USER");
        assertThat(user.getAccountStatus()).isEqualTo("active");
        assertThat(user.getFirstName()).isEqualTo("First");
        assertThat(user.getLastName()).isEqualTo("Last");
        assertThat(user.getShippingAddress()).isEqualTo("Test Address");
        assertThat(user.getCreatedAt()).isEqualTo(LocalDateTime.of(2025, 12, 1, 10, 30));
        assertThat(user.getUpdatedAt()).isEqualTo(LocalDateTime.of(2025, 12, 1, 11, 0));
        assertThat(user.getPaymentDueDays()).isEqualTo(14);
    }
}
