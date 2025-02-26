package com.example.lakicraft.controller;

import com.example.lakicraft.model.LacquerOrder;
import com.example.lakicraft.repository.LacquerOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("")
public class LacquerOrderController {

    private final LacquerOrderRepository lacquerOrderRepository;

    @Autowired
    public LacquerOrderController(LacquerOrderRepository lacquerOrderRepository) {
        this.lacquerOrderRepository = lacquerOrderRepository;
    }

    // Pobranie wszystkich zamówień lakierowania
    @GetMapping
    public List<LacquerOrder> getAllLacquerOrders() {
        return lacquerOrderRepository.findAll();
    }

  
    // Pobranie oczekujących zamówień lakierowania (wszystkich oprócz "zrealizowanych")
    @GetMapping("/{userId}/pending")
    public List<LacquerOrder> getNewLacquerOrdersByUser(@PathVariable Long userId) {
        return lacquerOrderRepository.findByClientIdAndStatus(userId, "nowe"); // Zmieniono status na "nowe"
    }
    
    @GetMapping("/api/lacquerOrders/user/{userId}")
    public List<LacquerOrder> getLacquerOrdersByUser(@PathVariable Long userId) {
        return lacquerOrderRepository.findByClientIdOrderByIdDesc(userId);
    }
    
    

    // Dodawanie zamówienia lakierowania
    
    @PostMapping
    public LacquerOrder createLacquerOrder(@RequestBody LacquerOrder lacquerOrder) {
        return lacquerOrderRepository.save(lacquerOrder);
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateLacquerOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> body) {
        if (!body.containsKey("status")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Brak pola 'status' w żądaniu."));
        }
    
        String status = body.get("status");
        Optional<LacquerOrder> optionalOrder = lacquerOrderRepository.findById(orderId);
    
        if (optionalOrder.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Zamówienie lakierowania o ID " + orderId + " nie istnieje."));
        }
    
        LacquerOrder order = optionalOrder.get();
        order.setStatus(status);
        lacquerOrderRepository.save(order);
    
        return ResponseEntity.ok().body(Map.of("message", "Status zamówienia zaktualizowany na: " + status));
    }
    

    
    
}
