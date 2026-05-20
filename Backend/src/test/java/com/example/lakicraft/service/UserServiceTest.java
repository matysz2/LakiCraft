package com.example.lakicraft.service;

import com.example.lakicraft.BaseUnitTest;
import com.example.lakicraft.model.User;
import com.example.lakicraft.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@DisplayName("UserService Unit Tests")
class UserServiceTest extends BaseUnitTest {

    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordService passwordService;

    @BeforeEach
    void setUp() {
        userService = new UserService(userRepository, passwordService);
    }

    @Test
    @DisplayName("Should get user without password")
    void testGetUserWithoutPassword() {
        // Arrange
        int userId = 1;
        User user = new User();
        user.setId(userId);
        user.setEmail("test@example.com");
        user.setPassword("hashedPassword");
        user.setFirstName("John");
        user.setLastName("Doe");

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        // Act
        User result = userService.getUserWithoutPassword(userId);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(userId);
        assertThat(result.getEmail()).isEqualTo("test@example.com");
        assertThat(result.getPassword()).isNull();
        assertThat(result.getFirstName()).isEqualTo("John");
        assertThat(result.getLastName()).isEqualTo("Doe");

        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    @DisplayName("Should return null when user not found for getUserWithoutPassword")
    void testGetUserWithoutPassword_UserNotFound() {
        // Arrange
        int userId = 999;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act
        User result = userService.getUserWithoutPassword(userId);

        // Assert
        assertThat(result).isNull();
        verify(userRepository, times(1)).findById(userId);
    }

    @Test
    @DisplayName("Should update user with all fields")
    void testUpdateUser_AllFields() {
        // Arrange
        int userId = 1;
        User existingUser = new User();
        existingUser.setId(userId);
        existingUser.setEmail("old@example.com");
        existingUser.setPassword("oldPassword");
        existingUser.setFirstName("Old");
        existingUser.setLastName("User");

        User updatedData = new User();
        updatedData.setEmail("new@example.com");
        updatedData.setPassword("newPassword");
        updatedData.setFirstName("New");
        updatedData.setLastName("UpdatedUser");

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(passwordService.hashPassword("newPassword")).thenReturn("hashedNewPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        User result = userService.updateUser(userId, updatedData);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(userId);
        assertThat(result.getEmail()).isEqualTo("new@example.com");
        assertThat(result.getFirstName()).isEqualTo("New");
        assertThat(result.getLastName()).isEqualTo("UpdatedUser");
        assertThat(result.getPassword()).isEqualTo("hashedNewPassword");

        verify(userRepository, times(1)).findById(userId);
        verify(passwordService, times(1)).hashPassword("newPassword");
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should update user with only email")
    void testUpdateUser_OnlyEmail() {
        // Arrange
        int userId = 1;
        User existingUser = new User();
        existingUser.setId(userId);
        existingUser.setEmail("old@example.com");
        existingUser.setPassword("hashedPassword");
        existingUser.setFirstName("John");
        existingUser.setLastName("Doe");

        User updatedData = new User();
        updatedData.setEmail("newemail@example.com");

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        User result = userService.updateUser(userId, updatedData);

        // Assert
        assertThat(result).isNotNull();
        assertThat(result.getEmail()).isEqualTo("newemail@example.com");
        assertThat(result.getFirstName()).isEqualTo("John"); // Unchanged
        assertThat(result.getLastName()).isEqualTo("Doe"); // Unchanged

        verify(passwordService, never()).hashPassword(any()); // Password not updated
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should return null when updating non-existent user")
    void testUpdateUser_UserNotFound() {
        // Arrange
        int userId = 999;
        User updatedData = new User();
        updatedData.setEmail("test@example.com");

        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act
        User result = userService.updateUser(userId, updatedData);

        // Assert
        assertThat(result).isNull();
        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should delete existing user")
    void testDeleteUser_Success() {
        // Arrange
        int userId = 1;
        User user = new User();
        user.setId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        doNothing().when(userRepository).delete(user);

        // Act
        boolean result = userService.deleteUser(userId);

        // Assert
        assertThat(result).isTrue();
        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, times(1)).delete(user);
    }

    @Test
    @DisplayName("Should return false when deleting non-existent user")
    void testDeleteUser_UserNotFound() {
        // Arrange
        int userId = 999;
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        // Act
        boolean result = userService.deleteUser(userId);

        // Assert
        assertThat(result).isFalse();
        verify(userRepository, times(1)).findById(userId);
        verify(userRepository, never()).delete(any());
    }
}
