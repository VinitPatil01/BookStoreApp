package com.cdac.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.dto.CartItemDto;
import com.cdac.dto.UserResp;
import com.cdac.security.CustomUserDetails;
import com.cdac.security.JwtUtils;
import com.cdac.service.CartService;
import com.cdac.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;
    private final UserService userService;
    private final JwtUtils jwtUtils;

    /**
     * Get current user's cart
     */
    @GetMapping
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<List<CartItemDto>> getCurrentUserCart(Authentication authentication) {
    	String email = authentication.getName();
	 	UserResp userDetails = userService.getUserByEmail(email);
    	Long userId = userDetails.getUserId();
        List<CartItemDto> cartItems = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cartItems);
    }

    /**
     * Add item to current user's cart
     */
    @PostMapping
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<CartItemDto> addToCart(@Valid @RequestBody CartItemDto cartItemDto,
    		Authentication authentication) {
    	 	String email = authentication.getName();
    	 	UserResp userDetails = userService.getUserByEmail(email);
        	Long userId = userDetails.getUserId();
            CartItemDto addedItem = cartService.addToCart(userId, cartItemDto);
            return new ResponseEntity<>(addedItem, HttpStatus.CREATED);
    }

    /**
     * Update cart item quantity for current user
     */
    @PutMapping("/book/{bookId}")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<CartItemDto> updateCartItem(@PathVariable Long bookId,
                                                    @RequestParam int quantity,
                                                    Authentication authentication) {
        try {
        	String email = authentication.getName();
    	 	UserResp userDetails = userService.getUserByEmail(email);
        	Long userId = userDetails.getUserId();
            CartItemDto updatedItem = cartService.updateCartItem(userId, bookId,quantity);
            if (updatedItem == null) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(updatedItem);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Remove item from current user's cart
     */
    @DeleteMapping("/book/{bookId}")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long bookId,
    		Authentication authentication) {
    	String email = authentication.getName();
	 	UserResp userDetails = userService.getUserByEmail(email);
    	Long userId = userDetails.getUserId();
        boolean removed = cartService.removeFromCart(userId, bookId);
        if (removed) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Clear current user's cart
     */
    @DeleteMapping
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<Void> clearCart(Authentication authentication) {
    	String email = authentication.getName();
	 	UserResp userDetails = userService.getUserByEmail(email);
    	Long userId = userDetails.getUserId();
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get current user's cart total
     */
    @GetMapping("/total")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<Map<String, Double>> getCartTotal(Authentication authentication) {
    	String email = authentication.getName();
	 	UserResp userDetails = userService.getUserByEmail(email);
    	Long userId = userDetails.getUserId();
        double total = cartService.getCartTotal(userId);
        return ResponseEntity.ok(Map.of("total", total));
    }

    /**
     * Get current user's cart item count
     */
    @GetMapping("/count")
    @PreAuthorize("hasRole('BUYER')")
    public ResponseEntity<Map<String, Integer>> getCartItemCount(Authentication authentication) {
    	String email = authentication.getName();
	 	UserResp userDetails = userService.getUserByEmail(email);
    	Long userId = userDetails.getUserId();
        List<CartItemDto> items = cartService.getCartByUserId(userId);
        int totalCount = items.stream().mapToInt(CartItemDto::getQuantity).sum();
        return ResponseEntity.ok(Map.of("count", totalCount));
    }

    // ADMIN ENDPOINTS

    /**
     * Admin: Get any user's cart
     */
    @GetMapping("/admin/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<CartItemDto>> getUserCart(@PathVariable Long userId) {
        List<CartItemDto> cartItems = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cartItems);
    }

    /**
     * Admin: Clear any user's cart
     */
    @DeleteMapping("/admin/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> adminClearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}