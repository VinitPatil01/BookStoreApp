package com.cdac.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cdac.custom_exceptions.NotFoundException;
import com.cdac.dao.BookDao;
import com.cdac.dao.CartDao;
import com.cdac.dao.CartItemDao;
import com.cdac.dao.UserDao;
import com.cdac.dto.CartItemDto;
import com.cdac.entities.Book;
import com.cdac.entities.Cart;
import com.cdac.entities.CartItem;
import com.cdac.entities.User;

@Service
public class CartService {

    @Autowired
    private CartDao cartDao;

    @Autowired
    private CartItemDao cartItemDao;

    @Autowired
    private BookDao bookDao;

    @Autowired
    private UserDao userDao;
    @Autowired
    private ModelMapper modelMapper;

    public List<CartItemDto> getCartByUserId(Long userId) {
        Cart cart = cartDao.findByUser_UserId(userId).orElseThrow(()-> new NotFoundException("user not found"));
        System.out.println(cart);
        if (cart!=null) {
            List<CartItem> cartItems = cartItemDao.findByCart_CartId(cart.getCartId());
            List<CartItemDto> dtoItems = cartItems.stream().map(cartItem -> modelMapper.map(cartItem, CartItemDto.class)).collect(Collectors.toList());
            return dtoItems;
        }
        return List.of();
    }

    public CartItemDto addToCart(Long userId, CartItemDto cartItemDto) {
        Cart cart = getOrCreateCart(userId);
        
        // Check if item already exists in cart
        Optional<CartItem> existingItem = cartItemDao
                .findByCart_CartIdAndBook_BookId(cart.getCartId(), cartItemDto.getBookId());
        
        CartItem cartItem;
        if (existingItem.isPresent()) {
            // Update quantity if item exists
            cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + cartItemDto.getQuantity());
        } else {
            // Create new cart item
            cartItem = new CartItem();
            cartItem.setCart(cart);
            Optional<Book> book = bookDao.findById(cartItemDto.getBookId());
            if (book.isEmpty()) {
                throw new RuntimeException("Book not found with id: " + cartItemDto.getBookId());
            }
            cartItem.setBook(book.get());
            cartItem.setQuantity(cartItemDto.getQuantity());
        }
        
        CartItem savedItem = cartItemDao.save(cartItem);
        return convertToDto(savedItem);
    }

    public CartItemDto updateCartItem(Long userId, Long bookId, int quantity) {
        Optional<Cart> cart = cartDao.findByUser_UserId(userId);
        if (cart.isEmpty()) {
            throw new RuntimeException("Cart not found for user: " + userId);
        }
        
        Optional<CartItem> cartItem = cartItemDao
                .findByCart_CartIdAndBook_BookId(cart.get().getCartId(), bookId);
        
        if (cartItem.isEmpty()) {
            throw new RuntimeException("Cart item not found");
        }
        
        CartItem item = cartItem.get();
        if (quantity <= 0) {
            cartItemDao.delete(item);
            return null;
        }
        
        item.setQuantity(quantity);
        CartItem updatedItem = cartItemDao.save(item);
        return convertToDto(updatedItem);
    }

    public boolean removeFromCart(Long userId, Long bookId) {
        Optional<Cart> cart = cartDao.findByUser_UserId(userId);
        if (cart.isEmpty()) {
            return false;
        }
        
        Optional<CartItem> cartItem = cartItemDao
                .findByCart_CartIdAndBook_BookId(cart.get().getCartId(), bookId);
        
        if (cartItem.isPresent()) {
            cartItemDao.delete(cartItem.get());
            return true;
        }
        return false;
    }

    public void clearCart(Long userId) {
        Optional<Cart> cart = cartDao.findByUser_UserId(userId);
        if (cart.isPresent()) {
            List<CartItem> cartItems = cartItemDao.findByCart_CartId(cart.get().getCartId());
            cartItemDao.deleteAll(cartItems);
        }
    }

    public double getCartTotal(Long userId) {
        List<CartItemDto> cartItems = getCartByUserId(userId);
        return cartItems.stream()
                .mapToDouble(item -> {
                    Optional<Book> book = bookDao.findById(item.getBookId());
                    return book.map(b -> b.getPrice() * item.getQuantity()).orElse(0.0);
                })
                .sum();
    }

    private Cart getOrCreateCart(Long userId) {
        Optional<Cart> existingCart = cartDao.findByUser_UserId(userId);
        if (existingCart.isPresent()) {
            return existingCart.get();
        }
        
        // Create new cart for user
        Optional<User> user = userDao.findById(userId);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found with id: " + userId);
        }
        
        Cart newCart = new Cart();
        newCart.setUser(user.get());
        return cartDao.save(newCart);
    }

    private CartItemDto convertToDto(CartItem cartItem) {
        CartItemDto dto = new CartItemDto();
        dto.setBookId(cartItem.getBook().getBookId());
        dto.setQuantity(cartItem.getQuantity());
        return dto;
    }
}