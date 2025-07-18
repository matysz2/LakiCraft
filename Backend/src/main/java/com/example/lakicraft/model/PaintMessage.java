package com.example.lakicraft.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class PaintMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "lacquer_order_id", nullable = false)
    private LacquerOrder lacquerOrder; // Zamówienie lakierowania, do którego należy wiadomość

    @Column(nullable = false)
    private String message; // Treść wiadomości

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Stolarz wysyłający wiadomość

    @Column(nullable = false)
    private LocalDateTime sentAt; // Data wysłania wiadomości

    @ManyToOne
    @JoinColumn(name = "lacker_id", nullable = false)
    private User lacquerer; // Lakiernik, który koresponduje ze stolarzem
    
    public PaintMessage() {
        this.sentAt = LocalDateTime.now();
    }
}
