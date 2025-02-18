package com.example.lakicraft.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.lakicraft.model.Orders;

public interface OrderRepository extends JpaRepository<Orders, Long> {

    @Query("SELECT o FROM Orders o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.product WHERE o.seller.id = :userId ORDER BY o.orderDate DESC")
    List<Orders> findBySellerId(@Param("userId") Long userId);
    
}
