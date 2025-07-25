package com.example.lakicraft.controller;

import com.example.lakicraft.model.BusinessCard;
import com.example.lakicraft.repository.BusinessCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/business-card")
@RequiredArgsConstructor
@CrossOrigin(origins = "https://localhost:3000")  // ✅ pozwalamy Reactowi
public class BusinessCardController {

    private final BusinessCardRepository businessCardRepository;

    // katalog do uploadów
    private static final String UPLOAD_DIR = "uploads";

    /**
     * ✅ Pobierz wizytówkę użytkownika
     */
    @GetMapping
    public ResponseEntity<?> getBusinessCard(@RequestParam Long userId) {
        return businessCardRepository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * ✅ Utwórz nową wizytówkę
     */
    @PostMapping("/create")
    public ResponseEntity<?> createBusinessCard(
            @RequestParam Long userId,
            @RequestParam String name,
            @RequestParam String jobTitle,
            @RequestParam String bio,
            @RequestParam String contactEmail,
            @RequestParam(required = false) MultipartFile profileImage
    ) throws IOException {

        BusinessCard card = new BusinessCard();
        card.setUserId(userId);
        card.setName(name);
        card.setJobTitle(jobTitle);
        card.setBio(bio);
        card.setContactEmail(contactEmail);

        if (profileImage != null && !profileImage.isEmpty()) {
            String relativePath = saveFile(userId, profileImage);
            card.setProfileImageUrl(relativePath);
        }

        return ResponseEntity.ok(businessCardRepository.save(card));
    }

    /**
     * ✅ Edytuj istniejącą wizytówkę
     */
    @PatchMapping
    public ResponseEntity<?> updateBusinessCard(
            @RequestParam Long userId,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String jobTitle,
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) String contactEmail,
            @RequestParam(required = false) MultipartFile profileImage
    ) throws IOException {

        BusinessCard card = businessCardRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Brak wizytówki do edycji"));

        if (name != null) card.setName(name);
        if (jobTitle != null) card.setJobTitle(jobTitle);
        if (bio != null) card.setBio(bio);
        if (contactEmail != null) card.setContactEmail(contactEmail);

        if (profileImage != null && !profileImage.isEmpty()) {
            // usuń stare zdjęcie jeśli było
            deleteOldFile(card.getProfileImageUrl());
            // zapisz nowe
            String relativePath = saveFile(userId, profileImage);
            card.setProfileImageUrl(relativePath);
        }

        return ResponseEntity.ok(businessCardRepository.save(card));
    }

    /**
     * ✅ Pomocnicza metoda do zapisu pliku
     */
    private String saveFile(Long userId, MultipartFile file) throws IOException {
        String fileName = userId + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        Path target = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        return "uploads/" + fileName; // Zwracamy ścieżkę względną do frontendu
    }

    /**
     * ✅ Pomocnicza metoda do usuwania starego pliku
     */
    private void deleteOldFile(String oldPath) {
        if (oldPath != null && !oldPath.isEmpty()) {
            try {
                Path path = Paths.get(oldPath);
                if (Files.exists(path)) {
                    Files.delete(path);
                }
            } catch (Exception e) {
                System.err.println("⚠️ Nie udało się usunąć starego pliku: " + e.getMessage());
            }
        }
    }

    /**
 * ✅ Edytuj istniejącą wizytówkę – używamy POST, nie PATCH (mniej problemów z CORS)
 */
@PostMapping("/update")
public ResponseEntity<?> updateBusinessCardPost(
        @RequestParam Long userId,
        @RequestParam(required = false) String name,
        @RequestParam(required = false) String jobTitle,
        @RequestParam(required = false) String bio,
        @RequestParam(required = false) String contactEmail,
        @RequestParam(required = false) MultipartFile profileImage
) throws IOException {

    BusinessCard card = businessCardRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Brak wizytówki do edycji"));

    if (name != null) card.setName(name);
    if (jobTitle != null) card.setJobTitle(jobTitle);
    if (bio != null) card.setBio(bio);
    if (contactEmail != null) card.setContactEmail(contactEmail);

    if (profileImage != null && !profileImage.isEmpty()) {
        deleteOldFile(card.getProfileImageUrl());
        String relativePath = saveFile(userId, profileImage);
        card.setProfileImageUrl(relativePath);
    }

    return ResponseEntity.ok(businessCardRepository.save(card));
}

}
