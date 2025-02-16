package com.example.lakicraft.controller;

import com.example.lakicraft.model.Product;
import com.example.lakicraft.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.jpa.repository.JpaRepository; // Aby korzystać z JpaRepository

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000") // Upewnij się, że CORS jest poprawnie ustawione dla aplikacji React
@RestController
@RequestMapping("/api/products")
public class ProductController {

   @Autowired
    private ProductRepository productRepository;

    // Pobranie wszystkich produktów dla użytkownika na podstawie user_id z nagłówka
    @GetMapping
    public ResponseEntity<List<Product>> getProductsByUserId(@RequestHeader("user_id") int userId) {
        try {
            List<Product> products = productRepository.findByUserId(userId);
            if (products.isEmpty()) {
                return ResponseEntity.noContent().build(); // Jeśli brak produktów, zwróć 204 No Content
            }
            return ResponseEntity.ok(products); // Zwróć produkty
        } catch (Exception e) {
            e.printStackTrace(); // Dodaj logowanie błędu
            return ResponseEntity.status(500).body(null); // Zwróć 500 jeśli wystąpi błąd
        }
    }
    

    // Pobranie pojedynczego produktu na podstawie jego ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable("id") int id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            return ResponseEntity.ok(product.get()); // Zwróć znaleziony produkt
        }
        return ResponseEntity.notFound().build(); // Jeśli produkt nie istnieje, zwróć 404 Not Found
    }

    // Dodanie nowego produktu
    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody Product product, @RequestHeader("user_id")Long userId) {
        // Ustawiamy userId przed zapisaniem
        product.setUserId(userId);
        Product savedProduct = productRepository.save(product); // Zapisz produkt w bazie danych
        return ResponseEntity.status(201).body(savedProduct); // Zwróć zapisany produkt z kodem 201 (Created)
    }

    // Edytowanie produktu
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable("id") int id, @RequestBody Product product, @RequestHeader("user_id") Long userId) {
        Optional<Product> existingProduct = productRepository.findById(id);
        if (existingProduct.isPresent()) {
            Product updatedProduct = existingProduct.get();
            updatedProduct.setName(product.getName());
            updatedProduct.setKod(product.getKod());
            updatedProduct.setPackaging(product.getPackaging());
            updatedProduct.setPrice(product.getPrice());
            updatedProduct.setStock(product.getStock());
            updatedProduct.setBrand(product.getBrand());
            updatedProduct.setUserId(userId); // Ustawiamy userId

            Product savedProduct = productRepository.save(updatedProduct); // Zapisz zaktualizowany produkt
            return ResponseEntity.ok(savedProduct); // Zwróć zapisany produkt
        }
        return ResponseEntity.notFound().build(); // Jeśli produkt nie istnieje, zwróć 404 Not Found
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Integer productId,
            @RequestHeader("user_id") Long userId) {

        Optional<Product> productOptional = productRepository.findById(productId);

        if (productOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product product = productOptional.get();

        // Sprawdzenie, czy produkt należy do użytkownika
        if (!product.getUserId().equals(userId)) {
            return ResponseEntity.status(403).body("Brak uprawnień do usunięcia tego produktu");
        }

        productRepository.deleteById(productId);
        return ResponseEntity.ok().body("Produkt został pomyślnie usunięty");
    }

    @PutMapping("/products/{id}")
    public Product updateProduct(
        @PathVariable("id") Long productId,
        @RequestBody Product product,
        @RequestHeader("user_id") Long userId
    ) {
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id " + productId));
        
        // Sprawdzamy, czy użytkownik ma odpowiednie uprawnienia (np. ten sam userId)
        if (!existingProduct.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to edit this product.");
        }

        // Ustawiamy nowe wartości dla produktu
        existingProduct.setName(product.getName());
        existingProduct.setKod(product.getKod());
        existingProduct.setPackaging(product.getPackaging());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setStock(product.getStock());
        existingProduct.setBrand(product.getBrand());

        return productRepository.save(existingProduct); // Zapisujemy zaktualizowany produkt
    }
}

