package com.example.lakicraft.controller;

import com.example.lakicraft.BaseIntegrationTest;
import com.example.lakicraft.model.User;
import com.example.lakicraft.repository.UserRepository;
import com.example.lakicraft.service.PasswordService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@DisplayName("UserController Integration Tests")
class UserControllerIT extends BaseIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordService passwordService;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    private User createTestUser(String email, String firstName, String lastName) {
        User user = new User();
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPassword(passwordService.hashPassword("testPassword123"));
        return userRepository.save(user);
    }

    @Test
    @DisplayName("Should get user by id without password")
    void testGetUserById_Success() throws Exception {
        // Arrange
        User testUser = createTestUser("john@example.com", "John", "Doe");

        // Act & Assert
        mockMvc.perform(get("/api/users/{id}", testUser.getId())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", equalTo(testUser.getId())))
                .andExpect(jsonPath("$.email", equalTo("john@example.com")))
                .andExpect(jsonPath("$.firstName", equalTo("John")))
                .andExpect(jsonPath("$.lastName", equalTo("Doe")))
                .andExpect(jsonPath("$.password", nullValue()));
    }

    @Test
    @DisplayName("Should return 404 when user not found")
    void testGetUserById_NotFound() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/users/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Should update user successfully")
    void testUpdateUser_Success() throws Exception {
        // Arrange
        User testUser = createTestUser("john@example.com", "John", "Doe");
        
        User updateData = new User();
        updateData.setEmail("newemail@example.com");
        updateData.setFirstName("Jane");
        updateData.setLastName("Smith");

        // Act & Assert
        mockMvc.perform(put("/api/users/{id}", testUser.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateData)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", equalTo("newemail@example.com")))
                .andExpect(jsonPath("$.firstName", equalTo("Jane")))
                .andExpect(jsonPath("$.lastName", equalTo("Smith")));
    }

    @Test
    @DisplayName("Should delete user successfully")
    void testDeleteUser_Success() throws Exception {
        // Arrange
        User testUser = createTestUser("john@example.com", "John", "Doe");

        // Act & Assert
        mockMvc.perform(delete("/api/users/{id}", testUser.getId()))
                .andExpect(status().isOk());

        // Verify user is deleted
        mockMvc.perform(get("/api/users/{id}", testUser.getId()))
                .andExpect(status().isNotFound());
    }
}
