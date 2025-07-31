package com.example.lakicraft.repository;

import com.example.lakicraft.model.LacquerOrder;
import com.example.lakicraft.model.PaintMessage;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface LacquerOrderRepository extends JpaRepository<LacquerOrder, Long> {
    // Metoda do pobierania zamówień na lakierowanie na podstawie userId

    List<LacquerOrder> findByClientIdOrderByIdDesc(Long clientId);


     // Pobieranie niezrealizowanych zamówień dla użytkownika
     List<LacquerOrder> findByClientIdAndStatusNot(Long userId, String status);

     List<LacquerOrder> findByClientIdAndStatus(Long userId, String status);

     List<LacquerOrder> findByCarpenterId(Long carpenterId);
     
     List<LacquerOrder> findByStatus(String status);

     List<LacquerOrder> findByCarpenterIdOrderByIdDesc(Long carpenterId);
    
      // Zapytanie do obliczania łącznej liczby metrów malowania dla danego użytkownika
      @Query("SELECT SUM(l.paintingMeters) FROM LacquerOrder l")
    Double getTotalPaintingMeters();


    @Query("SELECT pm FROM PaintMessage pm JOIN FETCH pm.lacquerOrder WHERE pm.lacquerOrder.id = :lacquerOrderId")
List<PaintMessage> findByLacquerOrderId(@Param("lacquerOrderId") Long lacquerOrderId);

@Query("SELECT COUNT(l) FROM LacquerOrder l WHERE l.status = :status")
long countByStatus(@Param("status") String status);

 


     

    
    }
