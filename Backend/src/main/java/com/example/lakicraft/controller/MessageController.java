package com.example.lakicraft.controller;

import com.example.lakicraft.dto.MessageDTO;
import com.example.lakicraft.model.Message;
import com.example.lakicraft.model.Orders;
import com.example.lakicraft.repository.MessageRepository;
import com.example.lakicraft.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;



@RestController
@RequestMapping("/api/orders")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private OrderRepository orderRepository;

    // Pobieranie wiadomości dla konkretnego zamówienia
  @GetMapping("/{orderId}/messages")
public ResponseEntity<?> getMessagesByOrderId(@PathVariable Long orderId) {
    Optional<Orders> order = orderRepository.findById(orderId);
    if (order.isEmpty()) {
        return ResponseEntity.status(404).body("Zamówienie o podanym ID nie istnieje.");
    }

    List<Message> messages = messageRepository.findByOrder(order.get());

    List<MessageDTO> messageDTOs = messages.stream()
            .map(MessageDTO::new)
            .toList();

    return ResponseEntity.ok(messageDTOs);
}

    // Wysyłanie nowej wiadomości dla konkretnego zamówienia
    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getMessages(@RequestHeader("orderId") String orderId) {
        
        // Sprawdzanie, czy orderId jest prawidłowe
        if (orderId == null || orderId.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        // Konwersja orderId z String na Long
        Long parsedOrderId;
        try {
            parsedOrderId = Long.parseLong(orderId);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(null); // Zwrócenie błędu, jeśli orderId nie jest liczbą
        }
        
        // Pobieranie wiadomości z repozytorium na podstawie parsedOrderId
        List<Message> messages = messageRepository.findByOrderId(parsedOrderId);
        
        if (messages == null || messages.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        return ResponseEntity.ok(messages);
    }




    // Wysyłanie nowej wiadomości dla konkretnego zamówienia
@PostMapping("/{orderId}/messages")
public ResponseEntity<?> sendMessageToOrder(@PathVariable Long orderId, @RequestBody Message newMessage) {
    Optional<Orders> order = orderRepository.findById(orderId);
    if (order.isEmpty()) {
        return ResponseEntity.status(404).body("Zamówienie o podanym ID nie istnieje.");
    }

    newMessage.setOrder(order.get());

    try {
        Message savedMessage = messageRepository.save(newMessage);
        MessageDTO dto = new MessageDTO(savedMessage);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Błąd podczas wysyłania wiadomości.");
    }
}

}

