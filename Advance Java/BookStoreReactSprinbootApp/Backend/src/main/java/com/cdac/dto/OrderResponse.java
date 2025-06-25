package com.cdac.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.cdac.entities.OrderStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderResponse {
    private Long orderId;
    private LocalDateTime orderDate;
    private double totalAmount;
    private OrderStatus status;
    private List<CartItemDto> items;
}