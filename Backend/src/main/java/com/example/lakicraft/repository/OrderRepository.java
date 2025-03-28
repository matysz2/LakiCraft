package com.example.lakicraft.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.lakicraft.model.Orders;

import jakarta.transaction.Transactional;

public interface OrderRepository extends JpaRepository<Orders, Long> {


    
    @Query("SELECT o FROM Orders o LEFT JOIN FETCH o.orderItems oi LEFT JOIN FETCH oi.product WHERE o.seller.id = :userId ORDER BY o.orderDate DESC")
    List<Orders> findBySellerId(@Param("userId") Long userId);
    
    List<Orders> findByStatus(String status);
   
    @Query("SELECT o FROM Orders o LEFT JOIN FETCH o.orderItems WHERE o.id = :orderId")
    Orders findByIdWithItems(@Param("orderId") Long orderId);

    List<Orders> findByUserId(Long userId);

        List<Orders> findByUserIdOrderByOrderDateDesc(Long userId);
        long countByProductId(Long productId);  // Liczymy, ile razy produkt jest powiązany z zamówieniami


        List<Orders> findTop5ByUserIdOrderByOrderDateDesc(Long userId); 

        
            // Metoda licząca zamówienia dla danego produktu
            long countByOrderItems_Product_Id(Long productId);

            long count();

   


}
