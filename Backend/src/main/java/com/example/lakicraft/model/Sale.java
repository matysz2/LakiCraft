package com.example.lakicraft.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private Long userId;  // Zmieniamy na Long dla lepszego dopasowania z bazą danych

    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false)  // Relacja z Product
    private Product product;

    private BigDecimal amount;  // Zmieniamy na BigDecimal dla dokładniejszych obliczeń
    private BigDecimal totalPrice;  // Zmieniamy na BigDecimal

    private LocalDateTime saleDate;

    // Konstruktor domyślny
    public Sale() {
    }

    // Konstruktor z parametrami
    public Sale(Long userId, Product product, BigDecimal amount, BigDecimal totalPrice, LocalDateTime saleDate) {
        this.userId = userId;
        this.product = product;
        this.amount = amount;
        this.totalPrice = totalPrice;
        this.saleDate = saleDate;
    }

    // Gettery i settery
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public LocalDateTime getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDateTime saleDate) {
        this.saleDate = saleDate;
    }

    public void setUserId(Integer id2) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setUserId'");
    }
}
