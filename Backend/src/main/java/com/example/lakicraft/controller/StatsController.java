package com.example.lakicraft.controller;

import com.example.lakicraft.repository.LacquerOrderRepository;
import com.example.lakicraft.repository.SaleRepository;
import com.example.lakicraft.repository.OrderRepository;
import com.example.lakicraft.model.Stats;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
public class StatsController {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private LacquerOrderRepository lacquerOrderRepository;

    @GetMapping("/payment")
    public Stats getPaymentStats() {
        // Aggregating payment data
        Double totalRevenue = saleRepository.calculateTotalRevenueInPeriod(LocalDateTime.now().minusMonths(1), LocalDateTime.now());
        BigDecimal outstandingPayments = orderRepository.calculateOutstandingPayments();
        long totalTransactions = saleRepository.count();

        Stats stats = new Stats();
        stats.setTotalRevenue(totalRevenue);  // Use BigDecimal directly
        stats.setOutstandingPayments(outstandingPayments);  // Use BigDecimal directly
        stats.setTotalTransactions((int) totalTransactions);

        return stats;
    }

    @GetMapping("/sales")
    public Stats getSalesStats() {
        // Aggregating sales data
        Double totalSalesRevenue = saleRepository.calculateTotalRevenueInPeriod(LocalDateTime.now().minusMonths(1), LocalDateTime.now());
        long totalSalesCount = saleRepository.countSalesInPeriod(LocalDateTime.now().minusMonths(1), LocalDateTime.now());

        Stats salesStats = new Stats();
        salesStats.setTotalRevenue(totalSalesRevenue);  // Use BigDecimal directly
        salesStats.setTotalTransactions((int) totalSalesCount);

        return salesStats;
    }

    @GetMapping("/painting")
    public Stats getPaintingStats() {
        // Aggregating painting data
        Double totalPaintingMeters = lacquerOrderRepository.getTotalPaintingMeters();  // Assuming BigDecimal

        Stats paintingStats = new Stats();
        paintingStats.setTotalRevenue(totalPaintingMeters);  // Use BigDecimal directly
        paintingStats.setTotalTransactions(totalPaintingMeters.intValue()); // Converting BigDecimal to int for count of orders

        return paintingStats;
    }

    @GetMapping("/lacquer-orders-count")
    public long getLacquerOrdersCount() {
        return lacquerOrderRepository.count();
    }

    @GetMapping("/painting-statuses")
public Map<String, Long> getPaintingStatuses() {
    Map<String, Long> statusCounts = new HashMap<>();
    statusCounts.put("Nowe", lacquerOrderRepository.countByStatus("Nowe"));
    statusCounts.put("W realizacji", lacquerOrderRepository.countByStatus("W realizacji"));
    statusCounts.put("Zrealizowane", lacquerOrderRepository.countByStatus("Zrealizowane"));
    return statusCounts;
}

@GetMapping("/sales-statuses")
public Map<String, Long> getSalesOrderStatuses() {
    Map<String, Long> statuses = new HashMap<>();
    statuses.put("new", orderRepository.countByStatus("Nowe"));
    statuses.put("inProgress", orderRepository.countByStatus("W realizacji"));
    statuses.put("completed", orderRepository.countByStatus("Zrealizowane"));
    return statuses;
}


}
