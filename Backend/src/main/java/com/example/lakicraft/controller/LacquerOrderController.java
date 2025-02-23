package com.example.lakicraft.controller;

import com.example.lakicraft.model.LacquerOrder;
import com.example.lakicraft.repository.LacquerOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/lacquerOrders")
public class LacquerOrderController {

    private final LacquerOrderRepository lacquerOrderRepository;

    @Autowired
    public LacquerOrderController(LacquerOrderRepository lacquerOrderRepository) {
        this.lacquerOrderRepository = lacquerOrderRepository;
    }

    // Pobranie wszystkich zamówień lakierowania
    @GetMapping
    public List<LacquerOrder> getAllLacquerOrders() {
        return lacquerOrderRepository.findAll();
    }

  // Pobranie **niezrealizowanych** zamówień dla danego użytkownika
  @GetMapping("/user/{userId}/pending")
  public List<LacquerOrder> getPendingLacquerOrdersByUser(@PathVariable Long userId) {
      return lacquerOrderRepository.findByClientIdAndStatusNot(userId, "zrealizowane");
  }

    // Pobranie zamówień lakierowania po userId (np. po kliencie)
    @GetMapping("/user/{userId}")
    public List<LacquerOrder> getLacquerOrdersByUser(@PathVariable Long userId) {
        return lacquerOrderRepository.findByClientId(userId);
    }

    // Dodawanie zamówienia lakierowania
    @PostMapping
    public LacquerOrder createLacquerOrder(@RequestBody LacquerOrder lacquerOrder) {
        return lacquerOrderRepository.save(lacquerOrder);
    }
}
