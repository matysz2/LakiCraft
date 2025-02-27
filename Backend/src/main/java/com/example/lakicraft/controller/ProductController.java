package com.example.lakicraft.controller;

import com.example.lakicraft.model.Product;
import com.example.lakicraft.model.User;
import com.example.lakicraft.repository.ProductRepository;
import com.example.lakicraft.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:3000") // Upewnij się, że CORS jest poprawnie ustawione dla aplikacji React
@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    public ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    // Pobranie wszystkich produktów dla użytkownika na podstawie user_id z nagłówka
    @GetMapping
    public ResponseEntity<List<Product>> getProductsByUserId(@RequestHeader("user_id") Long userId) {
        try {
            // Zmieniono userId na obiekt User
            Optional<User> user = userRepository.findById(userId);
            if (user.isEmpty()) {
                return ResponseEntity.notFound().build(); // Jeśli użytkownik nie istnieje, zwróć 404
            }

            List<Product> products = productRepository.findByUser(user.get());
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
    public ResponseEntity<Product> getProductById(@PathVariable("id") Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            return ResponseEntity.ok(product.get()); // Zwróć znaleziony produkt
        }
        return ResponseEntity.notFound().build(); // Jeśli produkt nie istnieje, zwróć 404 Not Found
    }

    // Edytowanie produktu
   // Edytowanie produktu
@PutMapping("/{id}")
public ResponseEntity<Product> updateProduct(@PathVariable("id") Long id,
                                             @RequestBody Product product,
                                             @RequestHeader("user_id") Long userId) {  // Pobieramy user_id z nagłówka
    // Sprawdzamy, czy user_id jest poprawne
    if (userId == null) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);  // Jeśli brak user_id, zwróć błąd 400
    }

    // Szukamy produktu w bazie danych
    Optional<Product> existingProduct = productRepository.findById(id);

    if (existingProduct.isPresent()) {
        Product updatedProduct = existingProduct.get();

        // Sprawdzamy, czy użytkownik istnieje
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);  // Użytkownik nie znaleziony
        }
        User user = userOptional.get();
        updatedProduct.setUser(user); // Ustawiamy użytkownika w produkcie

        // Aktualizujemy tylko te pola, które zostały przekazane
        if (product.getName() != null) {
            updatedProduct.setName(product.getName());
        }
        if (product.getKod() != null) {
            updatedProduct.setKod(product.getKod());
        }
        if (product.getPackaging() != null) {
            updatedProduct.setPackaging(product.getPackaging());
        }
        if (product.getPrice() != null) {
            updatedProduct.setPrice(product.getPrice());
        }
        if (product.getStock() != null) {
            updatedProduct.setStock(product.getStock());
        }
        if (product.getBrand() != null) {
            updatedProduct.setBrand(product.getBrand());
        }

        // Zapisujemy zaktualizowany produkt
        productRepository.save(updatedProduct);

        return ResponseEntity.ok(updatedProduct); // Zwracamy zapisany produkt
    }

    return ResponseEntity.notFound().build(); // Jeśli produkt nie istnieje, zwróć 404 Not Found
}

    
    

    // Usuwanie produktu
    @DeleteMapping("/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId) {
        Optional<Product> productOptional = productRepository.findById(productId);
    
        if (productOptional.isEmpty()) {
            return ResponseEntity.notFound().build(); // Produkt nie znaleziony
        }
    
        Product product = productOptional.get();
    
        // Usunięcie produktu bez sprawdzania uprawnień
        productRepository.deleteById(productId); // Usunięcie produktu
    
        return ResponseEntity.ok().body("Produkt został pomyślnie usunięty"); // Potwierdzenie usunięcia
    }
    
    

    // Dodawanie nowego produktu z możliwością przesyłania zdjęcia
    @PostMapping
    public ResponseEntity<String> addProduct(
            @RequestParam("kod") String kod,
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam("stock") Integer stock,
            @RequestParam("brand") String brand,
            @RequestParam("packaging") Double packaging,
            @RequestParam("user_id") Long userId,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        try {
            // Tworzymy nowy obiekt produktu
            Product product = new Product();
            product.setKod(kod);
            product.setName(name);
            product.setPrice(price);
            product.setStock(stock);
            product.setBrand(brand);
            product.setPackaging(packaging);

            // Pobieramy użytkownika na podstawie userId
            Optional<User> user = userRepository.findById(userId);
            if (user.isEmpty()) {
                return ResponseEntity.notFound().build(); // Jeśli użytkownik nie istnieje, zwróć 404
            }

            product.setUser(user.get()); // Przypisujemy użytkownika do produktu

            // Obsługa przesyłania obrazu (jeśli został dołączony)
            if (image != null && !image.isEmpty()) {
                String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
                Path filePath = Paths.get("uploads/" + fileName);
                Files.createDirectories(filePath.getParent());
                Files.write(filePath, image.getBytes());
                product.setImagePath(filePath.toString());
            }

            productRepository.save(product);
            return ResponseEntity.ok("Produkt dodany pomyślnie!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Błąd przy dodawaniu produktu");
        }
    }
}
