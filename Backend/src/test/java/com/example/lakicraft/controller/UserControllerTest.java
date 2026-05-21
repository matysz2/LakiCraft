package com.example.lakicraft.controller;

import com.example.lakicraft.BaseUnitTest;
import com.example.lakicraft.model.User;
import com.example.lakicraft.repository.UserRepository;
import com.example.lakicraft.service.PasswordService;
import com.example.lakicraft.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@DisplayName("UserController Unit Tests")
class UserControllerTest extends BaseUnitTest {

    private UserController userController;

    @Mock
    private UserService userService;

    @Mock
    private PasswordService passwordService;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        userController = new UserController(userService, passwordService, userRepository);
    }

    @Test
    @DisplayName("Should return hello message")
    void testHello() {
        String result = userController.hello();

        assertThat(result).isEqualTo("Działa!");
    }

    @Test
    @DisplayName("Should login successfully when credentials are valid")
    void testLogin_Success() {
        Map<String, String> request = Map.of("email", "test@example.com", "password", "secret");
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("hashedSecret");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordService.checkPassword("secret", "hashedSecret")).thenReturn(true);

        ResponseEntity<Map<String, Object>> response = userController.login(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsEntry("message", "Zalogowano pomyślnie");
        assertThat(response.getBody()).containsKey("user");

        verify(userRepository, times(1)).findByEmail("test@example.com");
        verify(passwordService, times(1)).checkPassword("secret", "hashedSecret");
    }

    @Test
    @DisplayName("Should return 404 when login email is not found")
    void testLogin_UserNotFound() {
        Map<String, String> request = Map.of("email", "missing@example.com", "password", "secret");

        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        ResponseEntity<Map<String, Object>> response = userController.login(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).containsEntry("message", "Użytkownik o podanym e-mailu nie istnieje");
        verify(userRepository, times(1)).findByEmail("missing@example.com");
    }

    @Test
    @DisplayName("Should reject login when password is invalid")
    void testLogin_InvalidPassword() {
        Map<String, String> request = Map.of("email", "test@example.com", "password", "wrong");
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("hashedSecret");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));
        when(passwordService.checkPassword("wrong", "hashedSecret")).thenReturn(false);

        ResponseEntity<Map<String, Object>> response = userController.login(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).containsEntry("message", "Nieprawidłowe hasło");
    }
}
