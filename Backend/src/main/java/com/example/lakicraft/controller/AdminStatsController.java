

    

package com.example.lakicraft.controller;

import org.springframework.web.bind.annotation.*;

import com.example.lakicraft.model.LacquerOrder;
import com.example.lakicraft.repository.LacquerOrderRepository;
import com.example.lakicraft.repository.OrderRepository;
import com.example.lakicraft.repository.ProductRepository;
import com.example.lakicraft.repository.SaleRepository;
import com.example.lakicraft.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import java.util.Map;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/admin/stats")
public class AdminStatsController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final SaleRepository saleRepository;
    private final LacquerOrderRepository lacquerOrderRepository;

 

    public AdminStatsController(UserRepository userRepository, ProductRepository productRepository,
            OrderRepository orderRepository, SaleRepository saleRepository,
            LacquerOrderRepository lacquerOrderRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.saleRepository = saleRepository;
        this.lacquerOrderRepository = lacquerOrderRepository;
    }



    @GetMapping
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        long userCount = userRepository.count();
        long productCount = productRepository.count();
        long orderCount = orderRepository.count();
        Double lacquerorderCount = lacquerOrderRepository.getTotalPaintingMeters();
        BigDecimal totalSales = saleRepository.getTotalSales();

        Map<String, Object> stats = Map.of(
            "users", userCount,
            "products", productCount,
            "orders", orderCount,
            "orderslacquer", lacquerorderCount,
            "sales", totalSales
        );

        return ResponseEntity.ok(stats);
    }


       @PutMapping("/{orderId}/status")
    public ResponseEntity<LacquerOrder> updateOrderStatus(@PathVariable Long orderId, @RequestBody StatusUpdateRequest request) {
        return lacquerOrderRepository.findById(orderId).map(order -> {
            order.setStatus(request.getStatus());
            lacquerOrderRepository.save(order);
            return ResponseEntity.ok(order);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    static class StatusUpdateRequest {
        private String status;
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
