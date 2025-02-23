package com.example.lakicraft.repository;

import com.example.lakicraft.model.LacquerOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LacquerOrderRepository extends JpaRepository<LacquerOrder, Long> {
    // Metoda do pobierania zamówień na lakierowanie na podstawie userId
    List<LacquerOrder> findByClientId(Long clientId);

     // Pobieranie niezrealizowanych zamówień dla użytkownika
     List<LacquerOrder> findByClientIdAndStatusNot(Long userId, String status);
}
