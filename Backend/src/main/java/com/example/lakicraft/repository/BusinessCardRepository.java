package com.example.lakicraft.repository;

import com.example.lakicraft.model.BusinessCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BusinessCardRepository extends JpaRepository<BusinessCard, Long> {
    Optional<BusinessCard> findByUserId(Long userId);
}
