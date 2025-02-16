package com.example.lakicraft.controller;

import com.example.lakicraft.model.User;
import com.example.lakicraft.repository.UserRepository;
import com.example.lakicraft.service.PasswordService;
import com.example.lakicraft.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final PasswordService passwordService; // Możesz teraz usunąć tę usługę, jeśli nie będzie potrzebna
    private final UserRepository userRepository;

    
    public UserController(UserService userService, PasswordService passwordService, UserRepository userRepository) {
        this.userService = userService;
        this.passwordService = passwordService; // Możesz usunąć, jeśli nie jest już używane
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
    
        return (ResponseEntity<Map<String, Object>>) userRepository.findByEmail(email)
            .map(user -> {
                if (user.getPassword().equals(password)) {  // Użyj odpowiedniego mechanizmu porównania
                    return ResponseEntity.ok(Map.of("message", "Zalogowano pomyślnie", "user", user));
                } else {
                    return ResponseEntity.status(401).body(Map.of("message", "Nieprawidłowe hasło"));
                }
            })
            .orElseGet(() -> ResponseEntity.status(404).body(Map.of("message", "Użytkownik o podanym e-mailu nie istnieje")));
    }
    



    // Endpoint do pobierania użytkownika bez hasła
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

    // Endpoint do aktualizacji użytkownika
    @PutMapping("")
    public ResponseEntity<Map<String, Object>> updateUser(@RequestParam("id") int id, @RequestBody User updatedUser) {
        try {
            User user = userService.updateUser(id, updatedUser);
            if (user != null) {
                user.setPassword(null); // Ukrywamy hasło przed zwróceniem odpowiedzi
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

    // Endpoint do usuwania użytkownika
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
      // Endpoint do wylogowania
      @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader(value = "Session-Id", required = false) String sessionId, HttpSession session) {
        if (sessionId != null) {
            // Możesz sprawdzić lub zalogować numer sesji jeśli to konieczne
        }

        try {
            session.invalidate(); // Usuwamy dane sesji
            return ResponseEntity.ok(Map.of("message", "Wylogowano pomyślnie"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "Wystąpił błąd podczas wylogowania", "error", e.getMessage()));
        }
    }
}
