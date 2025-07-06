package com.example.lakicraft.controller;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.lakicraft.repository.SaleRepository;

@CrossOrigin(origins = {
    "http://localhost:3000",
    "https://lakicraft.netlify.app"
})
 // Upewnij się, że CORS jest poprawnie ustawione dla aplikacji React
@RequestMapping("/api")
@RestController
public class SaleController {

    @Autowired
    private SaleRepository saleRepository;

@GetMapping("/sales/total")
public BigDecimal getTotalSalesByUserId(@RequestHeader("userId") Long userId) {
    return saleRepository.getTotalSalesByUserId(userId);
}
}