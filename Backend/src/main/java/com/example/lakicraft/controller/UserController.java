package com.example.lakicraft.controller;

import com.example.lakicraft.model.User;
import com.example.lakicraft.repository.UserRepository;
import com.example.lakicraft.service.PasswordService;
import com.example.lakicraft.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "https://localhost:3000")
public class UserController {

    private final UserService userService;
    private final PasswordService passwordService;
    private final UserRepository userRepository;

    public UserController(UserService userService, PasswordService passwordService, UserRepository userRepository) {
        this.userService = userService;
        this.passwordService = passwordService;
        this.userRepository = userRepository;
    }

    @GetMapping("/test-cors")
    public ResponseEntity<Map<String, Object>> testCors() {
        return ResponseEntity.ok(Map.of(
            "message", "CORS działa poprawnie!",
            "timestamp", LocalDateTime.now()
        ));
    }

    @GetMapping("/test")
    public String hello() {
        return "Działa!";
    }

@PostMapping("/login")
public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
    String email = loginRequest.get("email");
    String password = loginRequest.get("password");

    Optional<User> optionalUser = userRepository.findByEmail(email);

    if (optionalUser.isPresent()) {
        User user = optionalUser.get();
        if (passwordService.checkPassword(password, user.getPassword())) {
            return ResponseEntity.ok(Map.of("message", "Zalogowano pomyślnie", "user", user));
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Nieprawidłowe hasło"));
        }
    } else {
        return ResponseEntity.status(404).body(Map.of("message", "Użytkownik o podanym e-mailu nie istnieje"));
    }
}

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            if (userRepository.existsByEmail(user.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                     .body("Użytkownik z tym adresem e-mail już istnieje.");
            }

            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            user.setAccountStatus("active");
            user.setPaymentDueDays(0);

            // Hashujemy hasło przed zapisem
            String hashedPassword = passwordService.hashPassword(user.getPassword());
            user.setPassword(hashedPassword);

            User registeredUser = userRepository.save(user);

            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Błąd rejestracji użytkownika.");
        }
    }

    // Endpoint do zmiany hasła
    @PutMapping("/change-password/{userId}")
    public ResponseEntity<?> changePassword(@PathVariable Long userId, @RequestBody Map<String, String> passwords) {
        String currentPassword = passwords.get("currentPassword");
        String newPassword = passwords.get("newPassword");

        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (!passwordService.checkPassword(currentPassword, user.getPassword())) {
                return ResponseEntity.status(401).body(Map.of("message", "Nieprawidłowe aktualne hasło."));
            }

            String hashedNewPassword = passwordService.hashPassword(newPassword);
            user.setPassword(hashedNewPassword);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Hasło zostało zmienione."));
        } else {
            return ResponseEntity.status(404).body(Map.of("message", "Użytkownik nie znaleziony"));
        }
    }

    // Reszta Twoich metod (pozostawiam bez zmian)

    @GetMapping("")
    public ResponseEntity<Map<String, Object>> getUserWithoutPassword(@RequestParam("id") int id) {
        try {
            User user = userService.getUserWithoutPassword(id);
            if (user != null) {
                return ResponseEntity.ok(Map.of(
                    "message", "Użytkownik znaleziony",
                    "user", user
                ));
            }
            return ResponseEntity.status(404).body(Map.of("message", "Użytkownik nie znaleziony"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Wystąpił błąd na serwerze", "error", e.getMessage()));
        }
    }

    @PutMapping("")
    public ResponseEntity<Map<String, Object>> updateUser(@RequestParam("id") int id, @RequestBody User updatedUser) {
        try {
            User user = userService.updateUser(id, updatedUser);
            if (user != null) {
                user.setPassword(null);
                return ResponseEntity.ok(Map.of(
                    "message", "Dane użytkownika zostały zaktualizowane.",
                    "user", user
                ));
            }
            return ResponseEntity.status(404).body(Map.of("message", "Użytkownik nie znaleziony"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Wystąpił błąd podczas aktualizacji", "error", e.getMessage()));
        }
    }

    @DeleteMapping("")
    public ResponseEntity<Map<String, Object>> deleteUser(@RequestParam("id") int id) {
        try {
            boolean deleted = userService.deleteUser(id);
            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "Użytkownik został usunięty."));
            }
            return ResponseEntity.status(404).body(Map.of("message", "Użytkownik nie znaleziony"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Wystąpił błąd podczas usuwania", "error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader(value = "Session-Id", required = false) String sessionId, HttpSession session) {
        try {
            session.invalidate();
            return ResponseEntity.ok(Map.of("message", "Wylogowano pomyślnie"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Wystąpił błąd podczas wylogowania", "error", e.getMessage()));
        }
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/blockUser/{userId}")
    public ResponseEntity<Void> blockUser(@PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setBlocked(true);
            userRepository.save(user);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            userRepository.delete(userOptional.get());
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

@PutMapping("/admin/users/{userId}")
public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody User updatedUser) {
    Optional<User> userOptional = userRepository.findById(userId);
    if (userOptional.isPresent()) {
        User user = userOptional.get();
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setEmail(updatedUser.getEmail());
        user.setRole(updatedUser.getRole());
        user.setAccountStatus(updatedUser.getAccountStatus());
        user.setPaymentDueDays(updatedUser.getPaymentDueDays());
        user.setUpdatedAt(LocalDateTime.now()); // ✅ Dobrze aktualizować timestamp
        userRepository.save(user);
        return ResponseEntity.ok(user);
    } else {
        return ResponseEntity.notFound().build();
    }
}

}
