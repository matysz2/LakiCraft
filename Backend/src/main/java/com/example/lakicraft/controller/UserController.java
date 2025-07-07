package com.example.lakicraft.controller;

import com.example.lakicraft.model.User;
import com.example.lakicraft.repository.UserRepository;
import com.example.lakicraft.service.PasswordService;
import com.example.lakicraft.service.UserService;
import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;



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

    


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            // Sprawdzanie, czy użytkownik z podanym e-mailem już istnieje
            if (userRepository.existsByEmail(user.getEmail())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                     .body("Użytkownik z tym adresem e-mail już istnieje.");
            }
    
            // Ustawienie daty utworzenia i aktualizacji
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            user.setAccountStatus("active");
            user.setPaymentDueDays(0); // Możesz dostosować domyślną wartość
    
            // Zapis użytkownika do bazy danych
            User registeredUser = userRepository.save(user);
    
            // Logowanie odpowiedzi
            System.out.println("Zarejestrowany użytkownik: " + registeredUser);
    
            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            System.out.println("Błąd: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Błąd rejestracji użytkownika.");
        }
    }
    

    // Pobieranie wszystkich użytkowników
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Blokowanie użytkownika
    @PostMapping("/blockUser/{userId}")
    public ResponseEntity<Void> blockUser(@PathVariable Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Zakładamy, że blokowanie użytkownika to zmiana statusu
            user.setBlocked(true); // Przykład ustawienia statusu blokady
            userRepository.save(user); // Zapisz zaktualizowanego użytkownika
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

     // Usuwanie użytkownika
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
             user.setAccountStatus(updatedUser.getAccountStatus()); // Dodana linia
             userRepository.save(user);
             return ResponseEntity.ok(user);
         } else {
             return ResponseEntity.notFound().build();
         }
     }
     

     
}


