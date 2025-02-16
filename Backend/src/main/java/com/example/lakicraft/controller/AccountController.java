package com.example.lakicraft.controller;

import com.example.lakicraft.model.User;
import com.example.lakicraft.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/user")  // Ustawienie wspólnego prefiksu dla endpointów
public class AccountController {

    
    private UserRepository userRepository;

    // Pobranie danych użytkownika po ID
    @GetMapping("/{userData}")
    public ResponseEntity<?> getUser(@PathVariable Integer userId) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()) {
            return ResponseEntity.status(404).body("{\"message\": \"Użytkownik nie znaleziony\"}");
        }

        return ResponseEntity.ok(user.get());
    }

    // Usuwanie konta użytkownika po ID
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer userId) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()) {
            return ResponseEntity.status(404).body("{\"message\": \"Użytkownik nie istnieje\"}");
        }

        userRepository.deleteById(userId);
        return ResponseEntity.ok("{\"message\": \"Konto zostało usunięte\"}");
    }
}
