package com.example.lakicraft.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.lakicraft.model.Sale;

public interface SaleRepository extends JpaRepository<Sale, Integer> {


   @Query("SELECT COALESCE(SUM(s.amount), 0) FROM Sale s WHERE s.userId = :userId")
BigDecimal getTotalSalesByUserId(@Param("userId") Long userId);


@Query("SELECT COALESCE(SUM(s.totalPrice), 0) FROM Sale s")
BigDecimal getTotalSales();

}