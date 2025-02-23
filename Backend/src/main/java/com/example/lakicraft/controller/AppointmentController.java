package com.example.lakicraft.controller;

import com.example.lakicraft.model.Appointment;
import com.example.lakicraft.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;

    @Autowired
    public AppointmentController(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    // Pobieranie dostępnych terminów dla konkretnego użytkownika
    @GetMapping("/api/appointments")
    public List<Appointment> getAppointments(@RequestParam Long userId) {
        return appointmentRepository.findByUserId(userId);
    }
}
