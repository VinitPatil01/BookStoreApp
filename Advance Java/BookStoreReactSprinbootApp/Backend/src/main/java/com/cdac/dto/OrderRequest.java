package com.cdac.dto;

import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequest {
    private Double totalAmount;
    private String shippingAddress;
    private String status; // Will be converted to OrderStatus enum in service layer
    private List<OrderItemDto> items;
    
    @Getter
    @Setter
    public static class OrderItemDto {
        private Long bookId;
        private Integer quantity;
        private Double priceAtPurchase;
    }
}