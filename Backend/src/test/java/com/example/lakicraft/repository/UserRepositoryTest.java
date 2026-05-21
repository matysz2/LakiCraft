package com.example.lakicraft.repository;

import com.example.lakicraft.model.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
@DisplayName("UserRepository Integration Tests")
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Should find user by email")
    void testFindByEmail() {
        User user = new User();
        user.setEmail("user-test@example.com");
        user.setPassword("secret");
        user.setFirstName("Test");
        user.setLastName("User");

        userRepository.save(user);

        Optional<User> loaded = userRepository.findByEmail("user-test@example.com");

        assertThat(loaded).isPresent();
        assertThat(loaded.get().getEmail()).isEqualTo("user-test@example.com");
    }

    @Test
    @DisplayName("Should verify existing email via existsByEmail")
    void testExistsByEmail() {
        User user = new User();
        user.setEmail("exists-test@example.com");
        userRepository.save(user);

        boolean exists = userRepository.existsByEmail("exists-test@example.com");

        assertThat(exists).isTrue();
    }
}
