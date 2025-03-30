package com.example.lakicraft.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

@Getter
@Setter
@Entity
public class LacquerOrder {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User client; // Użytkownik składający zamówienie

    @Column(nullable = false)
    private String lacquer; // Wybrany lakier

    @Column(nullable = false)
    private LocalDateTime orderDate; // Data zamówienia

    @Column(nullable = false)
    private BigDecimal totalPrice; // Cena całkowita za lakierowanie

    @Column(nullable = false)
    private String status; // Status zamówienia (np. "w trakcie", "zrealizowane")

    @Column(nullable = false)
    private String shippingAddress; // Adres dostawy

    @JsonIdentityReference
    @ManyToOne
    @JoinColumn(name = "carpenter_id", nullable = false) // Stolarz zamawiający lakierowanie
    private User carpenter; 

    @ManyToOne
    @JoinColumn(name = "appointment_id", nullable = true) // Relacja do Appointment
    private Appointment appointment;

    @JsonDeserialize
    @Column(nullable = false)
    private Double paintingMeters; // Liczba metrów malowania

    // Opcjonalna metoda do obliczania ceny na podstawie metry
    public void calculateTotalPrice(BigDecimal pricePerMeter) {
        if (this.paintingMeters != null && pricePerMeter != null) {
            this.totalPrice = pricePerMeter.multiply(new BigDecimal(this.paintingMeters));
        }
    }
    
}

