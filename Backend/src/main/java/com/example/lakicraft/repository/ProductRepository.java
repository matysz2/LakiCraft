package com.example.lakicraft.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.lakicraft.model.Product;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findByUserId(Integer userId); // Zwraca produkty dla użytkownika o danym ID

    void deleteById(@SuppressWarnings("null") Integer productId); // Zmieniono typ na Integer

    Optional<Product> findById(Long id);}
