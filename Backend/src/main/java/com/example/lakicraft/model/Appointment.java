package com.example.lakicraft.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")
    @Column(nullable = false)
    private LocalDateTime date; // Data terminu

    @Column(nullable = false)
    private String status; // Status terminu (np. "Potwierdzony", "Anulowany")

    private String description; // Opis terminu (np. "Lakierowanie szafki")

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Powiązanie z użytkownikiem, który zarezerwował termin

}
