package com.example.lakicraft.dto;
import com.example.lakicraft.model.Orders;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Long id;
    private LocalDateTime orderDate;
    private BigDecimal totalPrice;
    private String status;
    private String shippingAddress;
    private String sellerName;   // np. imię/nazwa sprzedawcy
    private List<OrderItemDTO> items;

    // jeśli chcesz, możesz tutaj dodać statyczną metodę do konwersji
    public static OrderDTO fromOrder(Orders order) {
        String sellerDisplayName = null;
        if (order.getSeller() != null) {
            sellerDisplayName = order.getSeller().getFirstName() + " " + order.getSeller().getLastName();
        }

        List<OrderItemDTO> orderItems = order.getOrderItems().stream()
            .map(oi -> new OrderItemDTO(
                oi.getProduct().getId(),
                oi.getProduct().getName(),
                oi.getQuantity(),
                oi.getPrice()
            ))
            .toList();

        return new OrderDTO(
            order.getId(),
            order.getOrderDate(),
            order.getTotalPrice(),
            order.getStatus(),
            order.getShippingAddress(),
            sellerDisplayName,
            orderItems
        );
    }
}
