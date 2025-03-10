package com.example.lakicraft.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import com.example.lakicraft.model.OrderItem;
import com.example.lakicraft.model.Orders;
import com.example.lakicraft.model.Product;
import com.example.lakicraft.model.Sale;
import com.example.lakicraft.model.User;
import com.example.lakicraft.repository.OrderItemRepository;
import com.example.lakicraft.repository.OrderRepository;
import com.example.lakicraft.repository.OrderStatusRepository;
import com.example.lakicraft.repository.ProductRepository;
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
 
    @Autowired
    private final ProductRepository productRepository;

    @Autowired
    private final OrderItemRepository orderItemRepository;



    public OrderController(OrderRepository orderRepository, SaleRepository saleRepository,
            UserRepository userRepository, OrderStatusRepository orderStatusRepository,
            ProductRepository productRepository, OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.saleRepository = saleRepository;
        this.userRepository = userRepository;
        this.orderStatusRepository = orderStatusRepository;
        this.productRepository = productRepository;
        this.orderItemRepository = orderItemRepository;
    }



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
    public ResponseEntity<String> updateOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, Object> requestBody) {
        // Pobranie statusu i userId z ciała żądania
        String status = (String) requestBody.get("status");
        
        // Rzutowanie userId na Long, jeśli jest typu Integer
        Long userId = (requestBody.get("userId") instanceof Integer) 
                        ? Long.valueOf((Integer) requestBody.get("userId"))
                        : (Long) requestBody.get("userId");
    
        // Definicja dozwolonych statusów
        List<String> validStatuses = Arrays.asList("Nowe", "W realizacji", "Zrealizowane");
    
        // Sprawdzamy, czy status jest jednym z dozwolonych
        if (status == null || !validStatuses.contains(status)) {
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
                sale.setUserId(userId);  // Używamy userId z requestBody
                sale.setProduct(orderItem.getProduct());
                sale.setAmount(BigDecimal.valueOf(orderItem.getQuantity()));
                sale.setTotalPrice(orderItem.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity())));
                sale.setSaleDate(LocalDateTime.now());
    
                saleRepository.save(sale);
            }
        }
    
        return ResponseEntity.ok("{\"message\": \"Status zamówienia zaktualizowany na " + status + "\"}");
    }
    
   
      @GetMapping("/customer")
    public ResponseEntity<List<Orders>> getOrdersByCustomer(@RequestHeader("userId") Long userId) {
        List<Orders> orders = orderRepository.findByUserIdOrderByOrderDateDesc(userId);
        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orders);
    }


    @Transactional
    @GetMapping("/user-orders")
    public ResponseEntity<List<Orders>> getUserOrders(@RequestHeader("userId") Long userId) {
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }
        List<Orders> orders = orderRepository.findTop5ByUserIdOrderByOrderDateDesc(userId);
        return ResponseEntity.ok(orders);
    }

    
   // Endpoint do sprawdzania, czy produkt może być usunięty
@GetMapping("/order-items/check/{productId}")
public ResponseEntity<Map<String, Boolean>> checkProductDeletion(@PathVariable Long productId) {
    try {
        long count = orderRepository.countByOrderItems_Product_Id(productId);
        boolean canDelete = count == 0; // Jeśli liczba zależności wynosi 0, produkt może zostać usunięty

        Map<String, Boolean> response = Map.of("canDelete", canDelete);
        return ResponseEntity.ok(response);  // Zwracamy odpowiedź z informacją, czy produkt może zostać usunięty
    } catch (Exception e) {
        // Obsługuje błąd w przypadku nieoczekiwanych problemów
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", true));
    }
}


@PostMapping("/create")
public ResponseEntity<Orders> createOrder(@RequestBody Orders orderRequest) {
    // Pobranie użytkownika składającego zamówienie
    User buyer = userRepository.findById(orderRequest.getUser().getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Buyer not found"));

    // Pobranie sprzedawcy
    User seller = userRepository.findById(orderRequest.getSeller().getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Seller not found"));

    // Tworzenie nowego zamówienia
    Orders order = new Orders();
    order.setUser(buyer);
    order.setSeller(seller);
    order.setOrderDate(LocalDateTime.now());
    order.setTotalPrice(orderRequest.getTotalPrice());
    
    // Ustawienie statusu na 'Nowe' jeśli nie jest przekazany
    order.setStatus(orderRequest.getStatus() != null ? orderRequest.getStatus() : "Nowe");
    order.setShippingAddress(orderRequest.getShippingAddress());

    // Zapisanie zamówienia do bazy
    order = orderRepository.save(order);

    // Tworzenie pozycji zamówienia
    for (OrderItem orderItemRequest : orderRequest.getOrderItems()) {
        Product product = productRepository.findById(orderItemRequest.getProduct().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setQuantity(orderItemRequest.getQuantity());
        orderItem.setPrice(orderItemRequest.getPrice());

        // Zapisanie pozycji zamówienia
        orderItemRepository.save(orderItem);
    }

    // Zwrócenie utworzonego zamówienia
    return ResponseEntity.status(HttpStatus.CREATED).body(order);
}



}



