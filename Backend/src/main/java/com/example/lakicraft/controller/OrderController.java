package com.example.lakicraft.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.example.lakicraft.model.OrderStatus;
import com.example.lakicraft.model.Orders;
import com.example.lakicraft.model.Sale;
import com.example.lakicraft.repository.OrderRepository;
import com.example.lakicraft.repository.OrderStatusRepository;
import com.example.lakicraft.repository.SaleRepository;
import com.example.lakicraft.repository.UserRepository;

import jakarta.transaction.Transactional;

@CrossOrigin(origins = "http://localhost:3000") // Upewnij się, że CORS jest poprawnie ustawione dla aplikacji React
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderStatusRepository orderStatusRepository;
    // Pobranie zamówień dla zalogowanego użytkownika
    @GetMapping
    public ResponseEntity<List<Orders>> getOrders(@RequestHeader("userId") Long userId) {
        List<Orders> orders = orderRepository.findBySellerId(userId);
        
        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orders);
    }

   
    @PutMapping("/{orderId}/status")
    @Transactional
    public ResponseEntity<String> updateOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> request) {
        // Pobieramy status z requesta
        String status = request.get("status");
        if (status == null || !isValidStatus(status)) {
            return ResponseEntity.badRequest().body("{\"error\": \"Nieznany status\"}");
        }

        // Pobieramy zamówienie
        Orders order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.status(404).body("{\"error\": \"Zamówienie nie znalezione\"}");
        }

        // Zmieniamy status zamówienia
        order.setStatus(status);
        orderRepository.save(order);

        // Jeśli status to "Zrealizowane", zapisujemy sprzedaż
        if ("Zrealizowane".equals(status)) {
            order.getOrderItems().forEach(orderItem -> {
                Sale sale = new Sale();
                sale.setUserId(order.getUser().getId());  
                sale.setProduct(orderItem.getProduct());
                sale.setAmount(BigDecimal.valueOf(orderItem.getQuantity()));
                sale.setTotalPrice(orderItem.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity())));
                sale.setSaleDate(LocalDateTime.now());

                saleRepository.save(sale);
            });
        }

        return ResponseEntity.ok("{\"message\": \"Status zamówienia zaktualizowany na " + status + "\"}");
    }

    // Walidacja statusu
    private boolean isValidStatus(String status) {
        return "W realizacji".equals(status) || "Zrealizowane".equals(status) || "Anulowane".equals(status);
    }
    
}
