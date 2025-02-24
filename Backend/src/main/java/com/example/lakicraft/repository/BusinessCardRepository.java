package com.example.lakicraft.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.lakicraft.model.BusinessCard;

@Repository
public interface BusinessCardRepository extends JpaRepository<BusinessCard, Long> {

    @Query("SELECT bc FROM BusinessCard bc WHERE bc.userId = :userId")
    BusinessCard findByUserId(@Param("userId") Long userId);
}
