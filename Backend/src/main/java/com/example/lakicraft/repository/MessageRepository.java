package com.example.lakicraft.repository;

import com.example.lakicraft.model.Message;
import com.example.lakicraft.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByOrder(Orders order);  // Custom method to find messages by order
    List<Message> findByOrderId(Long orderId);
}
