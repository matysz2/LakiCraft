package com.example.lakicraft.controller;

import com.example.lakicraft.model.Appointment;
import com.example.lakicraft.model.LacquerOrder;
import com.example.lakicraft.model.User;
import com.example.lakicraft.repository.AppointmentRepository;
import com.example.lakicraft.repository.LacquerOrderRepository;
import com.example.lakicraft.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;



@RestController
@RequestMapping("")
public class LacquerOrderController {

    private final LacquerOrderRepository lacquerOrderRepository;

   @Autowired
    private UserRepository userRepository;


        @Autowired
    private AppointmentRepository appointmentRepository;


    @Autowired
    public LacquerOrderController(LacquerOrderRepository lacquerOrderRepository) {
        this.lacquerOrderRepository = lacquerOrderRepository;
    }

    // Pobranie wszystkich zamówień lakierowania
    @GetMapping("/api/lacquer-orders")
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
    

       // Pobranie zleceń lakierowania przypisanych do stolarza
       
       @GetMapping("/{userId}/painting-orders")
       public List<LacquerOrder> getPaintingOrdersByUser(@PathVariable Long userId) {
           return lacquerOrderRepository.findByCarpenterId(userId);  // Pobieranie zleceń na podstawie ID użytkownika
       }
       
       @GetMapping("/api/lacquerOrders/new")
       public List<LacquerOrder> getNewLacquerOrders() {
           return lacquerOrderRepository.findByStatus("nowe");
       }

       @GetMapping("/carpenter/{carpenterId}")
       public ResponseEntity<List<LacquerOrder>> getOrdersByCarpenter(@PathVariable Long carpenterId) {
           // Sortowanie zamówień malejąco według id
           List<LacquerOrder> orders = lacquerOrderRepository.findByCarpenterIdOrderByIdDesc(carpenterId);
           return ResponseEntity.ok(orders);
       }
       
    // Metoda usuwania zamówienia
    @DeleteMapping("/api/lacquerOrders/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        if (lacquerOrderRepository.existsById(orderId)) {
            lacquerOrderRepository.deleteById(orderId);
            return ResponseEntity.noContent().build(); // Usunięto bez zawartości w odpowiedzi
        } else {
            return ResponseEntity.notFound().build(); // Jeśli zamówienie nie istnieje
        }
    }
    @PostMapping("/api/lacquer-orders")
    public ResponseEntity<?> createLacquerOrder(@RequestBody LacquerOrder lacquerOrderRequest) {
        try {
            // Sprawdzanie, czy appointment jest poprawnie załadowane
            if (lacquerOrderRequest.getAppointment() == null || lacquerOrderRequest.getAppointment().getId() == null) {
                return ResponseEntity.badRequest().body("AppointmentId is required");
            }
    
            // Pobranie Appointment z bazy danych za pomocą ID
            Appointment appointment = appointmentRepository.findById(lacquerOrderRequest.getAppointment().getId())
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));
    
            // Zmieniamy status Appointment na "zajęty"
            appointment.setStatus("Zajęty");
            
            // Zapisujemy zaktualizowany status Appointment w bazie
            appointmentRepository.save(appointment);
    
            // Sprawdzanie, czy client i carpenter są przekazani poprawnie
            if (lacquerOrderRequest.getClient() == null) {
                return ResponseEntity.badRequest().body("Client is required");
            }
            if (lacquerOrderRequest.getCarpenter() == null) {
                return ResponseEntity.badRequest().body("Carpenter is required");
            }
    
            // Pobranie Client i Carpenter z bazy danych
            User client = userRepository.findById(lacquerOrderRequest.getClient().getId())
                    .orElseThrow(() -> new RuntimeException("Client not found"));
            User carpenter = userRepository.findById(lacquerOrderRequest.getCarpenter().getId())
                    .orElseThrow(() -> new RuntimeException("Carpenter not found"));
    
            // Ustawienie załadowanych obiektów w zamówieniu
            lacquerOrderRequest.setAppointment(appointment);
            lacquerOrderRequest.setClient(client);
            lacquerOrderRequest.setCarpenter(carpenter);
    
            // Obliczanie ceny na podstawie liczby metrów malowania
            BigDecimal totalPrice = new BigDecimal(lacquerOrderRequest.getPaintingMeters()).multiply(new BigDecimal("10"));
            lacquerOrderRequest.setTotalPrice(totalPrice);
    
            // Zapisanie zamówienia
            LacquerOrder lacquerOrder = lacquerOrderRepository.save(lacquerOrderRequest);
    
            // Zwrócenie zamówienia w odpowiedzi
            return ResponseEntity.ok(lacquerOrder);
        } catch (RuntimeException e) {
            // Obsługa błędów
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        } catch (Exception e) {
            // Obsługa nieoczekiwanych błędów
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }
    


   

 
}
    
    
