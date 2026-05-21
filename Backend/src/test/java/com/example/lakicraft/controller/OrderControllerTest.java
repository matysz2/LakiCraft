package com.example.lakicraft.controller;

import com.example.lakicraft.BaseUnitTest;
import com.example.lakicraft.model.OrderItem;
import com.example.lakicraft.model.Orders;
import com.example.lakicraft.model.Product;
import com.example.lakicraft.model.Sale;
import com.example.lakicraft.repository.OrderItemRepository;
import com.example.lakicraft.repository.OrderRepository;
import com.example.lakicraft.repository.OrderStatusRepository;
import com.example.lakicraft.repository.ProductRepository;
import com.example.lakicraft.repository.SaleRepository;
import com.example.lakicraft.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@DisplayName("OrderController Unit Tests")
class OrderControllerTest extends BaseUnitTest {

    private OrderController orderController;

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private SaleRepository saleRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrderStatusRepository orderStatusRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @BeforeEach
    void setUp() {
        orderController = new OrderController(orderRepository, saleRepository, userRepository,
                orderStatusRepository, productRepository, orderItemRepository);
    }

    @Test
    @DisplayName("Should update order status and save sale when status is Zrealizowane")
    void testUpdateOrderStatus_CreatesSale() {
        long orderId = 1L;
        long userId = 123L;

        Product product = new Product();
        product.setId(5L);
        product.setName("Test product");

        OrderItem orderItem = new OrderItem();
        orderItem.setProduct(product);
        orderItem.setQuantity(2);
        orderItem.setPrice(BigDecimal.valueOf(15.00));

        Orders order = new Orders();
        order.setId(orderId);
        order.setOrderItems(List.of(orderItem));
        order.setStatus("Nowe");

        when(orderRepository.findById(orderId)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Orders.class))).thenReturn(order);
        when(saleRepository.save(any(Sale.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<String> response = orderController.updateOrderStatus(orderId,
                Map.of("status", "Zrealizowane", "userId", userId));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("Status zamówienia zaktualizowany na Zrealizowane");
        assertThat(order.getStatus()).isEqualTo("Zrealizowane");

        verify(orderRepository, times(1)).findById(orderId);
        verify(orderRepository, times(1)).save(order);
        verify(saleRepository, times(1)).save(any(Sale.class));
    }

    @Test
    @DisplayName("Should return canDelete true when product is not linked to any order items")
    void testCheckProductDeletion_CanDelete() {
        long productId = 7L;

        when(orderRepository.countByOrderItems_Product_Id(productId)).thenReturn(0L);

        ResponseEntity<Map<String, Boolean>> response = orderController.checkProductDeletion(productId);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).containsEntry("canDelete", true);
        verify(orderRepository, times(1)).countByOrderItems_Product_Id(productId);
    }
}
