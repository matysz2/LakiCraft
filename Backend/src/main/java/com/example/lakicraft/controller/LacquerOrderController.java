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

    // Pobranie oczekujących zamówień lakierowania (status "nowe")
    @GetMapping("/{userId}/pending")
    public List<LacquerOrder> getNewLacquerOrdersByUser(@PathVariable Long userId) {
        return lacquerOrderRepository.findByClientIdAndStatus(userId, "nowe");
    }

    // Pobranie zamówień lakierowania danego użytkownika (klienta)
    @GetMapping("/api/lacquerOrders/user/{userId}")
    public List<LacquerOrder> getLacquerOrdersByUser(@PathVariable Long userId) {
        return lacquerOrderRepository.findByClientIdOrderByIdDesc(userId);
    }

    // Aktualizacja statusu zamówienia lakierowania
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
        return lacquerOrderRepository.findByCarpenterId(userId);
    }

    // Pobranie wszystkich nowych zamówień
    @GetMapping("/api/lacquerOrders/new")
    public List<LacquerOrder> getNewLacquerOrders() {
        return lacquerOrderRepository.findByStatus("nowe");
    }

    // Pobranie zamówień według stolarza, posortowanych malejąco po ID
    @GetMapping("/carpenter/{carpenterId}")
    public ResponseEntity<List<LacquerOrder>> getOrdersByCarpenter(@PathVariable Long carpenterId) {
        List<LacquerOrder> orders = lacquerOrderRepository.findByCarpenterIdOrderByIdDesc(carpenterId);
        return ResponseEntity.ok(orders);
    }

    // Usuwanie zamówienia
    @DeleteMapping("/api/lacquerOrders/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        if (lacquerOrderRepository.existsById(orderId)) {
            lacquerOrderRepository.deleteById(orderId);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Tworzenie zamówienia lakierowania
    @PostMapping("/api/lacquer-orders")
    public ResponseEntity<?> createLacquerOrder(@RequestBody LacquerOrder lacquerOrderRequest) {
        try {
            if (lacquerOrderRequest.getAppointment() == null || lacquerOrderRequest.getAppointment().getId() == null) {
                return ResponseEntity.badRequest().body("AppointmentId is required");
            }

            Appointment appointment = appointmentRepository.findById(lacquerOrderRequest.getAppointment().getId())
                    .orElseThrow(() -> new RuntimeException("Appointment not found"));

            appointment.setStatus("Zajęty");
            appointmentRepository.save(appointment);

            if (lacquerOrderRequest.getClient() == null) {
                return ResponseEntity.badRequest().body("Client is required");
            }
            if (lacquerOrderRequest.getCarpenter() == null) {
                return ResponseEntity.badRequest().body("Carpenter is required");
            }

            User client = userRepository.findById(lacquerOrderRequest.getClient().getId())
                    .orElseThrow(() -> new RuntimeException("Client not found"));
            User carpenter = userRepository.findById(lacquerOrderRequest.getCarpenter().getId())
                    .orElseThrow(() -> new RuntimeException("Carpenter not found"));

            lacquerOrderRequest.setAppointment(appointment);
            lacquerOrderRequest.setClient(client);
            lacquerOrderRequest.setCarpenter(carpenter);

            BigDecimal totalPrice = new BigDecimal(lacquerOrderRequest.getPaintingMeters()).multiply(new BigDecimal("10"));
            lacquerOrderRequest.setTotalPrice(totalPrice);

            LacquerOrder lacquerOrder = lacquerOrderRepository.save(lacquerOrderRequest);
            return ResponseEntity.ok(lacquerOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }

    // NOWY ENDPOINT - zwraca URL-e obrazków potrzebnych na frontendzie
    @GetMapping("/api/lacquer-order-images")
    public ResponseEntity<Map<String, String>> getLacquerOrderImages() {
        String baseUrl = System.getenv("APP_URL");
        if (baseUrl == null || baseUrl.isBlank()) {
            baseUrl = "https://localhost:8080";
        }

        Map<String, String> images = Map.of(
                "lacquerOrders", baseUrl + "/uploads/paint.webp",
                "lacquerHistory", baseUrl + "/uploads/empty.webp"
        );

        return ResponseEntity.ok(images);
    }

}
