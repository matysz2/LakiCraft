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

    // Tworzenie wizytówki
    @PostMapping("/create")
    public ResponseEntity<?> createBusinessCard(
            @RequestParam Long userId,
            @RequestParam String name,
            @RequestParam String jobTitle,
            @RequestParam String bio,
            @RequestParam String contactEmail,
            @RequestParam(required = false) MultipartFile profileImage) {

        if (businessCardRepository.findByUserId(userId) != null) {
            return ResponseEntity.badRequest().body("Wizytówka już istnieje.");
        }

        BusinessCard card = new BusinessCard();
        card.setUserId(userId);
        card.setName(name);
        card.setJobTitle(jobTitle);
        card.setBio(bio);
        card.setContactEmail(contactEmail);

        if (profileImage != null && !profileImage.isEmpty()) {
            if (!isValidImageExtension(profileImage.getOriginalFilename())) {
                return ResponseEntity.badRequest().body("Niedozwolony format pliku. Dozwolone: jpg, jpeg, png, gif.");
            }
            String fileName = saveImage(profileImage, userId);
            card.setProfileImageUrl(getImageUrl(fileName));
        }

        businessCardRepository.save(card);
        return ResponseEntity.ok(card);
    }

    // Aktualizacja lub częściowa edycja wizytówki z uploadem obrazka
    @PatchMapping
    @Transactional
    public ResponseEntity<?> updateBusinessCard(
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
            if (!isValidImageExtension(profileImage.getOriginalFilename())) {
                return ResponseEntity.badRequest().body("Niedozwolony format pliku. Dozwolone: jpg, jpeg, png, gif.");
            }
            String fileName = saveImage(profileImage, userId);
            card.setProfileImageUrl(getImageUrl(fileName));
        }

        businessCardRepository.save(card);
        return ResponseEntity.ok(card);
    }

    // Metoda do zapisu zdjęcia na dysk
    private String saveImage(MultipartFile file, Long userId) {
        try {
            String ext = getFileExtension(file.getOriginalFilename());
            String fileName = userId + "_profile." + ext;

            File dir = new File(UPLOAD_DIR);
            if (!dir.exists()) dir.mkdirs();

            Files.copy(file.getInputStream(), Paths.get(UPLOAD_DIR + fileName), StandardCopyOption.REPLACE_EXISTING);
            logger.info("Zapisano plik: {}", fileName);
            return fileName;
        } catch (IOException e) {
            logger.error("Błąd zapisu pliku", e);
            throw new RuntimeException("Błąd zapisu pliku", e);
        }
    }

    // Generowanie URL do zdjęcia (uwzględnia zmienną środowiskową lub localhost)
    private String getImageUrl(String fileName) {
        String baseUrl = System.getenv("APP_URL");
        if (baseUrl == null || baseUrl.isBlank()) {
            baseUrl = "http://localhost:8080";
        }
        return baseUrl + "/uploads/" + fileName;
    }

    private boolean isValidImageExtension(String fileName) {
        String[] validExtensions = {"jpg", "jpeg", "png", "gif"};
        String ext = getFileExtension(fileName).toLowerCase();
        for (String valid : validExtensions) {
            if (valid.equals(ext)) return true;
        }
        return false;
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) return "";
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }
}
