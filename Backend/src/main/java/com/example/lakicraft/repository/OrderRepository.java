package com.example.lakicraft.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.lakicraft.model.Orders;

public interface OrderRepository extends JpaRepository<Orders, Long> {

    @Query("SELECT o FROM Orders o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.product WHERE o.seller.id = :userId ORDER BY o.orderDate DESC")
    List<Orders> findBySellerId(@Param("userId") Long userId);
    
    List<Orders> findByStatus(String status);
   
    @Query("SELECT o FROM Orders o LEFT JOIN FETCH o.orderItems WHERE o.id = :orderId")
    Orders findByIdWithItems(@Param("orderId") Long orderId);

    List<Orders> findByUserId(Long userId);

        List<Orders> findByUserIdOrderByOrderDateDesc(Long userId);
        long countByProductId(Long productId);  // Liczymy, ile razy produkt jest powiązany z zamówieniami


    
            // Metoda licząca zamówienia dla danego produktu
            long countByOrderItems_Product_Id(Long productId);
}
