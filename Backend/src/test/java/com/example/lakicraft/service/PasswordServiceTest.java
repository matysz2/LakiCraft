package com.example.lakicraft.service;

import com.example.lakicraft.BaseIntegrationTest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.*;

@DisplayName("PasswordService Integration Tests")
class PasswordServiceTest extends BaseIntegrationTest {

    @Autowired
    private PasswordService passwordService;

    @Test
    @DisplayName("Should hash password successfully")
    void testHashPassword() {
        // Arrange
        String password = "testPassword123";

        // Act
        String hashedPassword = passwordService.hashPassword(password);

        // Assert
        assertThat(hashedPassword)
                .isNotNull()
                .isNotEmpty()
                .isNotEqualTo(password);
    }

    @Test
    @DisplayName("Should hash same password differently each time (due to salt)")
    void testHashPassword_DifferentEachTime() {
        // Arrange
        String password = "testPassword123";

        // Act
        String hash1 = passwordService.hashPassword(password);
        String hash2 = passwordService.hashPassword(password);

        // Assert - Different salt should produce different hashes
        assertThat(hash1).isNotEqualTo(hash2);
    }

    @Test
    @DisplayName("Should verify correct password")
    void testVerifyPassword_Success() {
        // Arrange
        String password = "testPassword123";
        String hashedPassword = passwordService.hashPassword(password);

        // Act
        boolean isValid = passwordService.checkPassword(password, hashedPassword);

        // Assert
        assertThat(isValid).isTrue();
    }

    @Test
    @DisplayName("Should reject incorrect password")
    void testVerifyPassword_Failure() {
        // Arrange
        String correctPassword = "correctPassword123";
        String wrongPassword = "wrongPassword456";
        String hashedPassword = passwordService.hashPassword(correctPassword);

        // Act
        boolean isValid = passwordService.checkPassword(wrongPassword, hashedPassword);

        // Assert
        assertThat(isValid).isFalse();
    }

    @Test
    @DisplayName("Should handle empty password")
    void testHashPassword_EmptyString() {
        // Arrange
        String password = "";

        // Act
        String hashedPassword = passwordService.hashPassword(password);

        // Assert
        assertThat(hashedPassword).isNotNull().isNotEmpty();
    }
}
