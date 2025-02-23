package com.example.lakicraft.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class LacquerOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User client; // Użytkownik składający zamówienie

    @Column(nullable = false)
    private  String lacquer; // Wybrany lakier

    @Column(nullable = false)
    private LocalDateTime orderDate; // Data zamówienia

    @Column(nullable = false)
    private BigDecimal totalPrice; // Cena całkowita za lakierowanie

    @Column(nullable = false)
    private String status; // Status zamówienia (np. "w trakcie", "zrealizowane")

    @Column(nullable = false)
    private String shippingAddress; // Adres dostawy

    @ManyToOne
    @JoinColumn(name = "carpenter_id", nullable = false) // lub nullable = true, jeśli nie zawsze stolarz jest przypisany
private User carpenter; // Stolarz zamawiający lakierowanie

    @Column(nullable = false)
    private BigDecimal paintingMeters; // Ilość metrów do malowania

}
