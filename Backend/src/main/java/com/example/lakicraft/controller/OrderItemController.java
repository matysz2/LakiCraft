package com.example.lakicraft.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.lakicraft.repository.OrderItemRepository;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping
public class OrderItemController {


     @Autowired
    private OrderItemRepository orderItemRepository;


      @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> checkIfProductCanBeDeleted(@PathVariable Long productId) {
        // Sprawdzamy, ile razy produkt jest powiązany z zamówieniami
        long count = orderItemRepository.countByProductId(productId);
        boolean canDelete = count == 0;
        System.out.println("Produkt o ID " + productId + " jest powiązany z " + count + " zamówieniami.");
        return ResponseEntity.ok(Map.of("canDelete", canDelete));
    }
}
