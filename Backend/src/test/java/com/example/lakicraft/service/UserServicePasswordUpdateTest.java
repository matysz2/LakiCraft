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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@DisplayName("UserService Password Update Unit Tests")
class UserServicePasswordUpdateTest extends BaseUnitTest {

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
    @DisplayName("Should hash password when updating user password")
    void testUpdateUser_HashesPassword() {
        int userId = 1;
        User existingUser = new User();
        existingUser.setId(userId);
        existingUser.setPassword("old-hash");

        User updatedUser = new User();
        updatedUser.setPassword("newPassword");

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(passwordService.hashPassword("newPassword")).thenReturn("new-hash");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.updateUser(userId, updatedUser);

        assertThat(result).isNotNull();
        assertThat(result.getPassword()).isEqualTo("new-hash");
        verify(passwordService, times(1)).hashPassword("newPassword");
        verify(userRepository, times(1)).save(existingUser);
    }

    @Test
    @DisplayName("Should preserve password when updated data contains no password")
    void testUpdateUser_WithoutPasswordPreservesExistingPassword() {
        int userId = 2;
        User existingUser = new User();
        existingUser.setId(userId);
        existingUser.setPassword("existing-hash");
        existingUser.setEmail("old@example.com");

        User updatedUser = new User();
        updatedUser.setEmail("new@example.com");

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.updateUser(userId, updatedUser);

        assertThat(result).isNotNull();
        assertThat(result.getPassword()).isEqualTo("existing-hash");
        assertThat(result.getEmail()).isEqualTo("new@example.com");
        verify(passwordService, never()).hashPassword(any());
        verify(userRepository, times(1)).save(existingUser);
    }
}
