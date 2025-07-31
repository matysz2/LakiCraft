package com.example.lakicraft.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.lakicraft.model.OrderItem;

import jakarta.transaction.Transactional;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    long countByProductId(Long productId);  // Liczymy, ile razy produkt jest powiązany z zamówieniami


    @Modifying
@Transactional
@Query("DELETE FROM OrderItem oi WHERE oi.product.id = :productId")
void deleteByProductId(@Param("productId") Long productId);


}