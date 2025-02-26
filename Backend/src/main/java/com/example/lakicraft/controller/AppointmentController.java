package com.example.lakicraft.controller;

import com.example.lakicraft.model.Appointment;
import com.example.lakicraft.model.User;
import com.example.lakicraft.repository.AppointmentRepository;
import com.example.lakicraft.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository; // Dodajemy repozytorium User

    @Autowired
    public AppointmentController(AppointmentRepository appointmentRepository, UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository; // Inicjalizujemy repozytorium User
    }

    // Pobieranie dostępnych terminów dla konkretnego użytkownika
    @GetMapping("/api/appointments")
    public List<Appointment> getAppointments(@RequestParam Integer userId) {  // Zmieniamy Long na Integer
        return appointmentRepository.findByUserId(userId);
    }

    // Dodawanie nowego terminu
    @Transactional
    @PostMapping("/api/appointments")
    public ResponseEntity<Appointment> addAppointment(@RequestBody Appointment newAppointment) {
        if (newAppointment.getDate() == null || newAppointment.getDescription().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Sprawdzamy, czy użytkownik istnieje w bazie danych
        Optional<User> user = userRepository.findById(newAppointment.getUser().getId()); // Zmieniamy Long na Integer
        if (!user.isPresent()) {
            return ResponseEntity.badRequest().body(null);
        }

        Appointment savedAppointment = appointmentRepository.save(newAppointment);
        return ResponseEntity.ok(savedAppointment);
    }

    // Usuwanie terminu
    @Transactional
    @DeleteMapping("/api/appointments/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Integer id) {  // Zmieniamy Long na Integer
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (!appointment.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        appointmentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
