package com.example.lakicraft.controller;

import com.example.lakicraft.model.Product;
import com.example.lakicraft.model.User;
import com.example.lakicraft.repository.OrderItemRepository;
import com.example.lakicraft.repository.ProductRepository;
import com.example.lakicraft.repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = {
    "http://localhost:3000",
    "https://lakicraft.netlify.app"
})

@RestController
@RequestMapping("/api/user")  // Ustawienie wspólnego prefiksu dla endpointów
public class AccountController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    // Pobranie danych użytkownika po ID
    @GetMapping("/{userData}")
    public ResponseEntity<?> getUser(@PathVariable Integer userId) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()) {
            return ResponseEntity.status(404).body("{\"message\": \"Użytkownik nie znaleziony\"}");
        }

        return ResponseEntity.ok(user.get());
    }

    // Usuwanie konta użytkownika po ID
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Integer userId) {
        Optional<User> user = userRepository.findById(userId);

        if (user.isEmpty()) {
            return ResponseEntity.status(404).body("{\"message\": \"Użytkownik nie istnieje\"}");
        }

        userRepository.deleteById(userId);
        return ResponseEntity.ok("{\"message\": \"Konto zostało usunięte\"}");
    }


    @RestController
    @RequestMapping("/api/user")
    public class AdminController {
    
        private final ProductRepository productRepository;
        private final OrderItemRepository orderItemRepository;
    
        @Autowired
        public AdminController(ProductRepository productRepository, OrderItemRepository orderItemRepository) {
            this.productRepository = productRepository;
            this.orderItemRepository = orderItemRepository;
        }
    
        @DeleteMapping("/admin/{productId}")
        @Transactional
        public ResponseEntity<?> deleteProduct(@PathVariable Long productId) {
            Optional<Product> productOptional = productRepository.findById(productId);
    
            if (productOptional.isEmpty()) {
                return ResponseEntity.notFound().build(); // Produkt nie znaleziony
            }
    
            // Najpierw usuń powiązane rekordy w order_item
            orderItemRepository.deleteByProductId(productId);
    
            // Następnie usuń produkt
            productRepository.deleteById(productId);
    
            return ResponseEntity.ok().body("Produkt został pomyślnie usunięty");
        }
    }
}    