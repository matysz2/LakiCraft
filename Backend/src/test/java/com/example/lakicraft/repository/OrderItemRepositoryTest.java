package com.example.lakicraft.repository;

import com.example.lakicraft.model.OrderItem;
import com.example.lakicraft.model.Orders;
import com.example.lakicraft.model.Product;
import com.example.lakicraft.model.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.*;

@DataJpaTest
@DisplayName("OrderItemRepository Integration Tests")
class OrderItemRepositoryTest {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    @DisplayName("Should count order items by product id")
    void testCountByProductId() {
        User user = new User();
        user.setEmail("orderitem-user@example.com");
        user = userRepository.save(user);

        Product product = new Product();
        product.setName("OrderItemProduct");
        product.setKod("OIP100");
        product.setStock(10);
        product.setPrice(29.99);
        product.setBrand("OrderBrand");
        product.setPackaging(10.0);
        product.setUser(user);
        product = productRepository.save(product);

        Orders order = new Orders();
        order.setUser(user);
        order.setSeller(user);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalPrice(new BigDecimal("29.99"));
        order.setStatus("paid");
        order.setShippingAddress("222 Example Ave");
        order = orderRepository.save(order);

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setQuantity(1);
        orderItem.setPrice(new BigDecimal("29.99"));
        orderItemRepository.save(orderItem);

        long count = orderItemRepository.countByProductId(product.getId());

        assertThat(count).isEqualTo(1);
    }

    @Test
    @DisplayName("Should delete order items by product id")
    void testDeleteByProductId() {
        User user = new User();
        user.setEmail("delete-orderitem-user@example.com");
        user = userRepository.save(user);

        Product product = new Product();
        product.setName("DeleteItemProduct");
        product.setKod("DIP150");
        product.setStock(20);
        product.setPrice(39.99);
        product.setBrand("DeleteBrand");
        product.setPackaging(5.0);
        product.setUser(user);
        product = productRepository.save(product);

        Orders order = new Orders();
        order.setUser(user);
        order.setSeller(user);
        order.setOrderDate(LocalDateTime.now());
        order.setTotalPrice(new BigDecimal("39.99"));
        order.setStatus("paid");
        order.setShippingAddress("789 Delete Lane");
        order = orderRepository.save(order);

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setQuantity(1);
        orderItem.setPrice(new BigDecimal("39.99"));
        orderItemRepository.save(orderItem);

        orderItemRepository.deleteByProductId(product.getId());

        assertThat(orderItemRepository.countByProductId(product.getId())).isEqualTo(0);
    }
}
