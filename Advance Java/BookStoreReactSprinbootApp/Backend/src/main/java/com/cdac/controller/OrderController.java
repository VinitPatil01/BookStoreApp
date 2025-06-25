package com.cdac.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.custom_exceptions.NotFoundException;
import com.cdac.dao.UserDao;
import com.cdac.dto.ApiResponse;
import com.cdac.dto.CartItemDto;
import com.cdac.dto.OrderRequest;
import com.cdac.dto.OrderResponse;
import com.cdac.dto.OrderStatusRequest;
import com.cdac.dto.OrderTotalResponse;
import com.cdac.entities.OrderStatus;
import com.cdac.entities.User;
import com.cdac.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;
    
    @Autowired
    private UserDao userDao;

    @PostMapping("/user/{userEmail}")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @PathVariable String userEmail,
            @Valid @RequestBody OrderRequest orderRequest) {
        
        System.out.println(userEmail);
        User user = userDao.findByEmail(userEmail)
            .orElseThrow(() -> new NotFoundException("User with email " + userEmail + " not found"));
        Long userId = user.getUserId();
        
        OrderResponse orderResponse = orderService.createOrder(userId, orderRequest);
        ApiResponse<OrderResponse> response = ApiResponse.success("Order created successfully", orderResponse);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/user/{userEmail}")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getUserOrders(@PathVariable String userEmail) {
        User user = userDao.findByEmail(userEmail)
            .orElseThrow(() -> new NotFoundException("User with email " + userEmail + " not found"));
        Long userId = user.getUserId();
        
        List<OrderResponse> orders = orderService.getOrdersByUserId(userId);
        ApiResponse<List<OrderResponse>> response = ApiResponse.success("Orders retrieved successfully", orders);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{orderId}/user/{userEmail}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @PathVariable Long orderId,
            @PathVariable String userEmail) {
        
        User user = userDao.findByEmail(userEmail)
            .orElseThrow(() -> new NotFoundException("User with email " + userEmail + " not found"));
        Long userId = user.getUserId();
        
        Optional<OrderResponse> orderResponse = orderService.getOrderById(orderId, userId);
        if (orderResponse.isEmpty()) {
            throw new NotFoundException("Order not found with ID " + orderId + " for this user");
        }
        
        ApiResponse<OrderResponse> response = ApiResponse.success("Order retrieved successfully", orderResponse.get());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/all")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders();
        ApiResponse<List<OrderResponse>> response = ApiResponse.success("All orders retrieved successfully", orders);
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/admin/{orderId}/status")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody OrderStatusRequest statusRequest) {
        
        Optional<OrderResponse> updatedOrder = orderService.updateOrderStatus(orderId, statusRequest.getStatus());
        if (updatedOrder.isEmpty()) {
            throw new NotFoundException("Order not found with ID " + orderId);
        }
        
        ApiResponse<OrderResponse> response = ApiResponse.success("Order status updated successfully", updatedOrder.get());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{orderId}/user/{userEmail}/cancel")
    public ResponseEntity<ApiResponse<String>> cancelOrder(
            @PathVariable Long orderId,
            @PathVariable String userEmail) {
        
        User user = userDao.findByEmail(userEmail)
            .orElseThrow(() -> new NotFoundException("User with email " + userEmail + " not found"));
        Long userId = user.getUserId();
        
        boolean cancelled = orderService.cancelOrder(orderId, userId);
        if (!cancelled) {
            throw new IllegalArgumentException("Order cannot be cancelled or not found");
        }
        
        ApiResponse<String> response = ApiResponse.success("Order cancelled successfully", "Order has been successfully cancelled");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/calculate-total")
    public ResponseEntity<ApiResponse<OrderTotalResponse>> calculateOrderTotal(
            @Valid @RequestBody List<CartItemDto> items) {
        
        double total = orderService.calculateOrderTotal(items);
        OrderTotalResponse responseData = new OrderTotalResponse(total);
        ApiResponse<OrderTotalResponse> response = ApiResponse.success("Order total calculated successfully", responseData);
        
        return ResponseEntity.ok(response);
    }

}