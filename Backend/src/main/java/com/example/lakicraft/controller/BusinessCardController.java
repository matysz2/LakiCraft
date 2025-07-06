package com.example.lakicraft.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.example.lakicraft.model.BusinessCard;
import com.example.lakicraft.repository.BusinessCardRepository;
import jakarta.transaction.Transactional;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@CrossOrigin(origins = {
    "http://localhost:3000",
    "https://lakicraft.netlify.app"
})

@RestController
@RequestMapping("/api/business-card")
public class BusinessCardController {

    private static final Logger logger = LoggerFactory.getLogger(BusinessCardController.class);

    @Autowired
    private BusinessCardRepository businessCardRepository;

    private static final String UPLOAD_DIR = "uploads/";

    // Pobieranie wizytówki
    @GetMapping
    public ResponseEntity<?> getBusinessCard(@RequestParam Long userId) {
        BusinessCard card = businessCardRepository.findByUserId(userId);
        if (card == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(card);
    }

    // Aktualizacja wizytówki (bez zdjęcia)
    @PutMapping
    @Transactional
    public ResponseEntity<?> updateBusinessCard(@RequestParam Long userId, @RequestBody BusinessCard updatedCard) {
        BusinessCard card = businessCardRepository.findByUserId(userId);
        if (card == null) {
            return ResponseEntity.notFound().build();
        }
        card.setName(updatedCard.getName());
        card.setJobTitle(updatedCard.getJobTitle());
        card.setBio(updatedCard.getBio());
        card.setContactEmail(updatedCard.getContactEmail());
        businessCardRepository.save(card);
        return ResponseEntity.ok(card);
    }

    // Aktualizacja wizytówki z obrazkiem (zmiana na PATCH)
    @PatchMapping
    public ResponseEntity<?> updateBusinessCardWithImage(
            @RequestParam Long userId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String jobTitle,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) String contactEmail,
            @RequestParam(required = false) MultipartFile profileImage) {
        BusinessCard card = businessCardRepository.findByUserId(userId);
        if (card == null) {
            return ResponseEntity.notFound().build();
        }

        if (name != null) card.setName(name);
        if (jobTitle != null) card.setJobTitle(jobTitle);
        if (bio != null) card.setBio(bio);
        if (contactEmail != null) card.setContactEmail(contactEmail);

        if (profileImage != null && !profileImage.isEmpty()) {
            // Walidacja rozszerzenia pliku
            if (!isValidImageExtension(profileImage.getOriginalFilename())) {
                return ResponseEntity.badRequest().body("Niedozwolony format pliku. Dozwolone formaty: jpg, jpeg, png, gif.");
            }

            try {
                // Obsługuje plik
                String fileName = userId + "_profile." + getFileExtension(profileImage.getOriginalFilename());
                String filePath = UPLOAD_DIR + fileName;

                // Tworzymy katalog, jeśli nie istnieje
                File uploadDir = new File(UPLOAD_DIR);
                if (!uploadDir.exists()) {
                    uploadDir.mkdirs();
                }

                // Zapisujemy plik
                Files.copy(profileImage.getInputStream(), Paths.get(filePath), StandardCopyOption.REPLACE_EXISTING);
                card.setProfileImageUrl("http://localhost:8080/uploads/" + fileName);

                logger.info("Plik zapisał się poprawnie: {}", filePath);
            } catch (IOException e) {
                logger.error("Błąd zapisu pliku. Ścieżka: {}", UPLOAD_DIR, e);
                return ResponseEntity.internalServerError().body("Błąd zapisu pliku.");
            }
        }

        businessCardRepository.save(card);
        return ResponseEntity.ok(card);
    }

    // Walidacja rozszerzenia pliku
    private boolean isValidImageExtension(String fileName) {
        String[] validExtensions = {"jpg", "jpeg", "png", "gif"};
        String fileExtension = getFileExtension(fileName).toLowerCase();
        
        for (String ext : validExtensions) {
            if (ext.equals(fileExtension)) {
                return true;
            }
        }
        return false;
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || fileName.lastIndexOf('.') == -1) {
            return ""; // Zwraca pusty ciąg, jeśli plik nie ma rozszerzenia
        }
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }
}
