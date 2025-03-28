package com.example.lakicraft.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.lakicraft.model.Product;
import com.example.lakicraft.model.User;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> { // Zmieniamy Integer na Long

    List<Product> findByUserId(Integer userId); // Wyszukiwanie produktów po ID użytkownika (userId pozostaje Integer)

    void deleteById(Long productId); // Zmieniamy typ na Long dla identyfikatora produktu

    // Dodaj metodę do znajdowania produktów dla konkretnego użytkownika
    List<Product> findByUser(User user);
    
@Modifying
@Query("DELETE FROM OrderItem oi WHERE oi.product.id = :productId")
void deleteByProductId(@Param("productId") Long productId);

@Query("SELECT DISTINCT p.brand FROM Product p")
List<String> findDistinctBrands();

//Zapytanie wszystkie produkty uzytkownika po brandzie
List<Product> findByUserIdAndBrand(Long userId, String brand);

@Query("SELECT COUNT(p) FROM Product p")
long getRowCount();
}


