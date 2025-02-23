package com.example.lakicraft.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.example.lakicraft.model.OrderItem;
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



   @Transactional
    @PutMapping("/{orderId}/status")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> requestBody) {
        // Pobieramy status z ciała żądania
        String status = requestBody.get("status");
        
        if (status == null || !isValidStatus(status)) {
            return ResponseEntity.status(400).body("{\"error\": \"Nieznany lub brakujący status\"}");
        }
    
        // Pobierz zamówienie
        Orders order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return ResponseEntity.status(404).body("{\"error\": \"Zamówienie nie znalezione\"}");
        }
    
        // Aktualizacja statusu zamówienia
        order.setStatus(status);
        orderRepository.save(order);
    
        // Jeśli status to "Zrealizowane", zapisz dane do tabeli Sale
        if ("Zrealizowane".equals(status)) {
            for (OrderItem orderItem : order.getOrderItems()) {
                Sale sale = new Sale();
                sale.setUserId(order.getUser().getId().longValue());
                sale.setProduct(orderItem.getProduct());
                sale.setAmount(BigDecimal.valueOf(orderItem.getQuantity()));
                sale.setTotalPrice(orderItem.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity())));
                sale.setSaleDate(LocalDateTime.now());
    
                saleRepository.save(sale);
            }
        }
    
        return ResponseEntity.ok("{\"message\": \"Status zamówienia zaktualizowany na " + status + "\"}");
    }
    
    // Metoda walidacji statusu
    private boolean isValidStatus(String status) {
        return status.equals("W realizacji") || status.equals("Zrealizowane") || status.equals("Anulowane");
    }
      // Pobranie zamówień dla klienta
   
   
      @GetMapping("/customer")
    public ResponseEntity<List<Orders>> getOrdersByCustomer(@RequestHeader("userId") Long userId) {
        List<Orders> orders = orderRepository.findByUserId(userId);
        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orders);
    }

}
