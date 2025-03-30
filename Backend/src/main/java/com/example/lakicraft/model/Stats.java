package com.example.lakicraft.model;

import java.math.BigDecimal;

public class Stats {
    private Double totalRevenue; // Zmieniamy z double na BigDecimal
    private BigDecimal outstandingPayments;
    private int totalTransactions;

    // Gettery i settery
    public Double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(Double totalPaintingMeters) {
        this.totalRevenue = totalPaintingMeters;
    }

    public BigDecimal getOutstandingPayments() {
        return outstandingPayments;
    }

    public void setOutstandingPayments(BigDecimal outstandingPayments) {
        this.outstandingPayments = outstandingPayments;
    }

    public int getTotalTransactions() {
        return totalTransactions;
    }

    public void setTotalTransactions(int totalTransactions) {
        this.totalTransactions = totalTransactions;
    }
}
