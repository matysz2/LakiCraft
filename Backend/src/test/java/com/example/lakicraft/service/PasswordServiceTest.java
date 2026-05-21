package com.example.lakicraft.service;

import com.example.lakicraft.BaseUnitTest;
import com.example.lakicraft.model.User;
import com.example.lakicraft.repository.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@DisplayName("PasswordService Unit Tests")
class PasswordServiceTest extends BaseUnitTest {

    private PasswordService passwordService;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        passwordService = new PasswordService(userRepository, new BCryptPasswordEncoder());
    }

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

    @Test
    @DisplayName("Should retrieve stored user password")
    void testGetUserPassword_Success() {
        // Arrange
        long userId = 1L;
        User user = new User();
        user.setPassword("storedPasswordHash");
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // Act
        String actualPassword = passwordService.getUserPassword(userId);

        // Assert
        assertThat(actualPassword).isEqualTo("storedPasswordHash");
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    @DisplayName("Should throw when retrieving password for missing user")
    void testGetUserPassword_UserNotFound() {
        // Arrange
        long userId = 999L;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act / Assert
        assertThatThrownBy(() -> passwordService.getUserPassword(userId))
                .isInstanceOf(UsernameNotFoundException.class)
                .hasMessage("User not found");
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    @DisplayName("Should save new password for existing user")
    void testSaveUserPassword_Success() {
        // Arrange
        long userId = 2L;
        User user = new User();
        user.setPassword(passwordService.hashPassword("initial"));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        passwordService.saveUserPassword(userId, "newSecret");

        // Assert
        assertThat(passwordService.checkPassword("newSecret", user.getPassword())).isTrue();
        assertThat(passwordService.checkPassword("initial", user.getPassword())).isFalse();
        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).save(user);
    }

    @Test
    @DisplayName("Should update user password using updateUserPassword")
    void testUpdateUserPassword_Success() {
        // Arrange
        long userId = 3L;
        User user = new User();
        user.setPassword(passwordService.hashPassword("before"));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        passwordService.updateUserPassword(userId, "after");

        // Assert
        assertThat(passwordService.checkPassword("after", user.getPassword())).isTrue();
        assertThat(passwordService.checkPassword("before", user.getPassword())).isFalse();
        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).save(user);
    }
}
