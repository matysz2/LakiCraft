package com.example.lakicraft.repository;

import com.example.lakicraft.model.PaintMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaintMessageRepository extends JpaRepository<PaintMessage, Long> {
    List<PaintMessage> findByLacquerOrderId(Long lacquerOrderId);
}
