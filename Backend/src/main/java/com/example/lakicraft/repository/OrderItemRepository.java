package com.example.lakicraft.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.lakicraft.model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    long countByProductId(Long productId);  // Liczymy, ile razy produkt jest powiązany z zamówieniami
}