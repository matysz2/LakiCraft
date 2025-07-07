package com.example.lakicraft.controller;

import com.example.lakicraft.model.LacquerOrder;
import com.example.lakicraft.model.PaintMessage;
import com.example.lakicraft.model.User;
import com.example.lakicraft.repository.PaintMessageRepository;
import com.example.lakicraft.repository.UserRepository;

import jakarta.transaction.Transactional;

import com.example.lakicraft.repository.LacquerOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;



@RestController
@RequestMapping("/api/lacquerOrders")
public class PaintMessageController {

    private final UserRepository userRepository;
    private final PaintMessageRepository paintMessageRepository;
    private final LacquerOrderRepository lacquerOrderRepository;

 // Constructor injection for all repositories
 public PaintMessageController(LacquerOrderRepository lacquerOrderRepository, 
 PaintMessageRepository paintMessageRepository,
 UserRepository userRepository) {
this.lacquerOrderRepository = lacquerOrderRepository;
this.paintMessageRepository = paintMessageRepository;
this.userRepository = userRepository;  // Ensuring that userRepository is initialized
}


    // Pobranie wszystkich wiadomości dla danego zamówienia
    @GetMapping("/{orderId}/messages")
    public List<PaintMessage> getMessagesByOrderId(@PathVariable Long orderId) {
        return paintMessageRepository.findByLacquerOrderId(orderId);
    }

    @Transactional
    @PostMapping("/{orderId}/message")
    public ResponseEntity<PaintMessage> createMessage(@PathVariable Long orderId, 
                                                     @RequestBody PaintMessage paintMessage) {
        // Sprawdzenie, czy zamówienie istnieje
        LacquerOrder lacquerOrder = lacquerOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Zamówienie lakierowania o ID " + orderId + " nie istnieje."));
    
        // Ustawienie zamówienia w wiadomości
        paintMessage.setLacquerOrder(lacquerOrder);
    
        // Walidacja: sprawdzenie, czy 'user' i 'lacquerer' są ustawione
        if (paintMessage.getUser() == null || paintMessage.getLacquerer() == null) {
            throw new RuntimeException("Użytkownik lub lakiernik nie może być nullem.");
        }
    
        // Ustawienie użytkownika i lakiernika (jeśli są dostępni)
        User sender = userRepository.findById(paintMessage.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Użytkownik o ID " + paintMessage.getUser().getId() + " nie istnieje."));
        paintMessage.setUser(sender);
    
        User lacquerer = userRepository.findById(paintMessage.getLacquerer().getId())
                .orElseThrow(() -> new RuntimeException("Lakiernik o ID " + paintMessage.getLacquerer().getId() + " nie istnieje."));
        paintMessage.setLacquerer(lacquerer);
    
        // Ustawienie daty wysłania wiadomości
        paintMessage.setSentAt(LocalDateTime.now());
    
        // Zapisanie wiadomości
        PaintMessage savedMessage = paintMessageRepository.save(paintMessage);
    
        // Zwrócenie odpowiedzi HTTP z kodem 201 (Created) i zapisanym obiektem wiadomości
        return new ResponseEntity<>(savedMessage, HttpStatus.CREATED);
    }
    
    }


