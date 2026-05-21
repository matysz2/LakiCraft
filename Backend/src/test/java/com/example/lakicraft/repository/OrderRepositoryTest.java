package com.example.lakicraft.repository;

import com.example.lakicraft.model.Orders;
import com.example.lakicraft.model.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
@DisplayName("OrderRepository Integration Tests")
class OrderRepositoryTest {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Should find orders by seller id")
    void testFindBySellerId() {
        User buyer = new User();
        buyer.setEmail("buyer@example.com");
        buyer = userRepository.save(buyer);

        User seller = new User();
        seller.setEmail("seller@example.com");
        seller = userRepository.save(seller);

        Orders order = new Orders();
        order.setUser(buyer);
        order.setSeller(seller);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalPrice(new BigDecimal("100.00"));
        order.setStatus("paid");
        order.setShippingAddress("123 Test Street");
        orderRepository.save(order);

        List<Orders> orders = orderRepository.findBySellerId(seller.getId().longValue());

        assertThat(orders).hasSize(1);
        assertThat(orders.get(0).getSeller().getEmail()).isEqualTo("seller@example.com");
    }

    @Test
    @DisplayName("Should count orders by status")
    void testCountByStatus() {
        User buyer = new User();
        buyer.setEmail("buyer2@example.com");
        buyer = userRepository.save(buyer);

        User seller = new User();
        seller.setEmail("seller2@example.com");
        seller = userRepository.save(seller);

        Orders paidOrder = new Orders();
        paidOrder.setUser(buyer);
        paidOrder.setSeller(seller);
        paidOrder.setOrderDate(LocalDateTime.now());
        paidOrder.setTotalPrice(new BigDecimal("55.00"));
        paidOrder.setStatus("paid");
        paidOrder.setShippingAddress("45 Test Road");
        orderRepository.save(paidOrder);

        Orders pendingOrder = new Orders();
        pendingOrder.setUser(buyer);
        pendingOrder.setSeller(seller);
        pendingOrder.setOrderDate(LocalDateTime.now());
        pendingOrder.setTotalPrice(new BigDecimal("75.00"));
        pendingOrder.setStatus("pending");
        pendingOrder.setShippingAddress("45 Test Road");
        orderRepository.save(pendingOrder);

        long paidCount = orderRepository.countByStatus("paid");

        assertThat(paidCount).isEqualTo(1);
    }
}
