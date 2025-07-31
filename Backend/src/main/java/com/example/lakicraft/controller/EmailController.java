package com.example.lakicraft.controller;
import com.example.lakicraft.model.ContactRequest;
import com.example.lakicraft.service.EmailService;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@Slf4j
public class EmailController {

    @Autowired
    private EmailService emailService;

    // Zmiana z @RequestParam na @RequestBody
    @PostMapping("/contact")
    public ResponseEntity<?> sendEmail(@RequestBody ContactRequest contactRequest) {
        try {
            // Walidacja pola message
            if (contactRequest.getMessage() == null || contactRequest.getMessage().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Treść wiadomości nie może być pusta"));
            }
    
            // Ustawienie domyślnego tematu
            String subject = "Wiadomość kontaktowa"; // Domyślny temat
    
            // Adres odbiorcy (Twoja poczta)
            String recipientEmail = "matysz21@wp.pl";
    
            // Wywołanie metody w emailService z imieniem użytkownika
            String result = emailService.sendEmail(recipientEmail, subject, contactRequest.getMessage(), contactRequest.getEmail(), contactRequest.getName());
    
            log.info("Email wysłany do: " + recipientEmail);
            return ResponseEntity.ok(Map.of("message", result));  // Odpowiedź JSON
        } catch (Exception e) {
            log.error("Błąd podczas wysyłania e-maila: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Błąd wysyłania e-maila: " + e.getMessage()));  // Odpowiedź JSON
        }
    }
    
    

}