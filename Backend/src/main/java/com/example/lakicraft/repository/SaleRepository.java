package com.example.lakicraft.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.lakicraft.model.Sale;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.jpa.repository.JpaRepository;


public interface SaleRepository extends JpaRepository<Sale, Integer> {


   @Query("SELECT COALESCE(SUM(s.amount), 0) FROM Sale s WHERE s.userId = :userId")
BigDecimal getTotalSalesByUserId(@Param("userId") Long userId);


@Query("SELECT COALESCE(SUM(s.totalPrice), 0) FROM Sale s")
BigDecimal getTotalSales();


@Query("SELECT COALESCE(SUM(s.totalPrice), 0) FROM Sale s")
BigDecimal calculateTotalRevenue();



@Query("SELECT SUM(s.totalPrice) FROM Sale s WHERE s.saleDate BETWEEN :startDate AND :endDate")
    Double calculateTotalRevenueInPeriod(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT COUNT(s) FROM Sale s WHERE s.saleDate BETWEEN :startDate AND :endDate")
    long countSalesInPeriod(LocalDateTime startDate, LocalDateTime endDate);


}