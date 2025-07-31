package com.example.lakicraft.controller;

import com.example.lakicraft.model.Appointment;
import com.example.lakicraft.model.User;
import com.example.lakicraft.repository.AppointmentRepository;
import com.example.lakicraft.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;



@RestController
@RequestMapping("/api/appointments") // Główna ścieżka kontrolera
public class AppointmentController {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    @Autowired
    public AppointmentController(AppointmentRepository appointmentRepository, UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    // Pobieranie dostępnych terminów dla konkretnego użytkownika
    @GetMapping
    public List<Appointment> getAppointments(@RequestParam Integer userId) {
        return appointmentRepository.findByUserId(userId);
    }

    // Pobieranie wszystkich terminów
    @GetMapping("/all")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAllByOrderByIdDesc();
        return ResponseEntity.ok(appointments);
    }

    // Dodawanie nowego terminu
    @Transactional
    @PostMapping
    public ResponseEntity<Appointment> addAppointment(@RequestBody Appointment newAppointment) {
        if (newAppointment.getDate() == null || newAppointment.getDescription().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Sprawdzamy, czy użytkownik istnieje w bazie danych
        Optional<User> user = userRepository.findById(newAppointment.getUser().getId());
        if (!user.isPresent()) {
            return ResponseEntity.badRequest().body(null);
        }

        Appointment savedAppointment = appointmentRepository.save(newAppointment);
        return ResponseEntity.ok(savedAppointment);
    }

    // Usuwanie terminu
    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Integer id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (!appointment.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        appointmentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Rezerwacja terminu (bez DTO)
    @PostMapping("/reserve")
    public ResponseEntity<String> reserveAppointment(@RequestBody Map<String, Object> request) {
        Long lacquererId = ((Number) request.get("lacquererId")).longValue();
        String orderDateStr = (String) request.get("orderId");
        String lacquer = (String) request.get("lacquer");
        int paintingMeters = (int) request.get("paintingMeters");

        Optional<User> userOptional = userRepository.findById(lacquererId);
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Lakiernik nie znaleziony.");
        }

        Appointment appointment = new Appointment();
        appointment.setUser(userOptional.get());

        try {
            appointment.setDate(LocalDateTime.parse(orderDateStr, FORMATTER)); // Konwersja String -> LocalDateTime
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Niepoprawny format daty.");
        }

        appointment.setStatus("Zarezerwowany");
        appointment.setDescription("Lakier: " + lacquer + ", Metry: " + paintingMeters);

        appointmentRepository.save(appointment);
        return ResponseEntity.ok("Termin zarezerwowany.");
    }


    // Pobieranie dostępnych terminów (status = "Wolny")
    @GetMapping("/available")
    public ResponseEntity<List<Appointment>> getAvailableAppointments() {
        List<Appointment> availableAppointments = appointmentRepository.findByStatusOrderByDateAsc("Wolny");
        if (availableAppointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(availableAppointments);
    }
    
}
