package com.example.lakicraft.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import com.example.lakicraft.model.Orders;
import com.example.lakicraft.repository.OrderRepository;

@CrossOrigin(origins = "http://localhost:3000") // Upewnij się, że CORS jest poprawnie ustawione dla aplikacji React
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    // Pobranie zamówień dla zalogowanego użytkownika
    @GetMapping
    public ResponseEntity<List<Orders>> getOrders(@RequestHeader("userId") Long userId) {
        List<Orders> orders = orderRepository.findBySellerId(userId);
        
        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orders);
    }




}
