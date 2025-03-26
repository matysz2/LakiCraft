package com.example.lakicraft.model;

import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;  // Zmieniamy Integer na Long, ponieważ w MySQL jest BIGINT

    private String name;
    private String kod;
    private Integer stock;
    private Double price;
    private String brand;

    @Column(name =  "packaging", columnDefinition = "DECIMAL(10,2)")  // Określamy typ DECIMAL(10,2)
    private Double packaging;

    @ManyToOne
    @JoinColumn(name = "user_id")  // użyj JoinColumn zamiast Column
    private User user;  // Zmieniamy userId na user (obiekt klasy User)

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Sale> sales;  // Relacja odwrotna - jeden produkt może mieć wiele sprzedaży

    @Column(name = "image_path") // Nowe pole na ścieżkę zdjęcia
    private String imagePath;

    @Column(name = "status", nullable = false)
private String status = "active"; // Domyślnie produkt jest aktywny

    // Gettery i Settery
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getKod() {
        return kod;
    }

    public void setKod(String kod) {
        this.kod = kod;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public List<Sale> getSales() {
        return sales;
    }

    public void setSales(List<Sale> sales) {
        this.sales = sales;
    }

    public Double getPackaging() {
        return packaging;
    }

    public void setPackaging(Double packaging) {
        this.packaging = packaging;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
