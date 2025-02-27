package com.example.lakicraft.controller;


import com.example.lakicraft.model.Product;
import com.example.lakicraft.repository.ProductRepository;
import com.example.lakicraft.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/lacquers")
@CrossOrigin(origins = "http://localhost:3000") // Dostosuj do adresu frontendu
public class LacquerController {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public LacquerController(ProductRepository productRepository, UserRepository userRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

 @GetMapping
public List<Product> getUniqueLacquers() {
    // Pobierz wszystkie produkty
    List<Product> allProducts = productRepository.findAll();

    // Filtrowanie unikalnych marek dla wszystkich użytkowników
    return allProducts.stream()
            .collect(Collectors.toMap(
                    p -> p.getBrand(), // Klucz unikalny tylko dla marki
                    p -> p,
                    (existing, replacement) -> existing)) // Unikamy duplikatów
            .values()
            .stream()
            .collect(Collectors.toList());
}

    
}
