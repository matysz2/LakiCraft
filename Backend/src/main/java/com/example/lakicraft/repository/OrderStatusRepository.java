package com.example.lakicraft.repository;

import com.example.lakicraft.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderStatusRepository extends JpaRepository<OrderStatus, Long> {
    // Metoda do wyszukiwania statusu na podstawie nazwy
    OrderStatus findByStatus(String status);
}
