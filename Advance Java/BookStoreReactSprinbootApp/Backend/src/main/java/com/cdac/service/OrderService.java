package com.cdac.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cdac.dao.BookDao;
import com.cdac.dao.OrderDao;
import com.cdac.dao.OrderItemDao;
import com.cdac.dao.UserDao;
import com.cdac.dto.BookDto;
import com.cdac.dto.CartItemDto;
import com.cdac.dto.CategoryDto;
import com.cdac.dto.OrderRequest;
import com.cdac.dto.OrderRequest.OrderItemDto;
import com.cdac.dto.OrderResponse;
import com.cdac.entities.Book;
import com.cdac.entities.Order;
import com.cdac.entities.OrderItem;
import com.cdac.entities.OrderStatus;
import com.cdac.entities.User;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderDao orderDao;

    @Autowired
    private OrderItemDao orderItemDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private BookDao bookDao;

    @Autowired
    private CartService cartService;

    public OrderResponse createOrder(Long userId, OrderRequest orderRequest) {
        Optional<User> user = userDao.findById(userId);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found with id: " + userId);
        }

        Order order = new Order();
        order.setUser(user.get());
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);

        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (OrderItemDto cartItemDto : orderRequest.getItems()) {
            Optional<Book> book = bookDao.findById(cartItemDto.getBookId());
            if (book.isEmpty()) {
                throw new RuntimeException("Book not found with id: " + cartItemDto.getBookId());
            }

            Book bookEntity = book.get();
            
            // Check if enough stock is available
            if (bookEntity.getStock() < cartItemDto.getQuantity()) {
                throw new RuntimeException("Insufficient stock for book: " + bookEntity.getTitle());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setBook(bookEntity);
            orderItem.setQuantity(cartItemDto.getQuantity());
            orderItem.setPriceAtPurchase(bookEntity.getPrice());

            orderItems.add(orderItem);
            totalAmount += bookEntity.getPrice() * cartItemDto.getQuantity();

            // Update book stock
            bookEntity.setStock(bookEntity.getStock() - cartItemDto.getQuantity());
            bookDao.save(bookEntity);
        }

        order.setTotalAmount(totalAmount);
        order.setItems(orderItems);
        Order savedOrder = orderDao.save(order);

        // Clear user's cart after successful order
        cartService.clearCart(userId);

        return convertToOrderResponse(savedOrder);
    }

    public List<OrderResponse> getOrdersByUserId(Long userId) {
        List<Order> orders = orderDao.findByUser_UserIdOrderByOrderDateDesc(userId);
        return orders.stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    public Optional<OrderResponse> getOrderById(Long orderId, Long userId) {
        Optional<Order> order = orderDao.findByOrderIdAndUser_UserId(orderId, userId);
        return order.map(this::convertToOrderResponse);
    }

    public List<OrderResponse> getAllOrders() {
        List<Order> orders = orderDao.findAllByOrderByOrderDateDesc();
        return orders.stream()
                .map(this::convertToOrderResponse)
                .collect(Collectors.toList());
    }

    public Optional<OrderResponse> updateOrderStatus(Long orderId, OrderStatus status) {
        Optional<Order> order = orderDao.findById(orderId);
        if (order.isPresent()) {
            Order orderEntity = order.get();
            orderEntity.setStatus(status);
            Order updatedOrder = orderDao.save(orderEntity);
            return Optional.of(convertToOrderResponse(updatedOrder));
        }
        return Optional.empty();
    }

    public boolean cancelOrder(Long orderId, Long userId) {
        Optional<Order> order = orderDao.findByOrderIdAndUser_UserId(orderId, userId);
        if (order.isPresent()) {
            Order orderEntity = order.get();
            
            // Only allow cancellation if order is pending or confirmed
            if (orderEntity.getStatus() == OrderStatus.PENDING ) {
                
                // Restore book stock
                for (OrderItem item : orderEntity.getItems()) {
                    Book book = item.getBook();
                    book.setStock(book.getStock() + item.getQuantity());
                    bookDao.save(book);
                }
                
                orderEntity.setStatus(OrderStatus.CANCELLED);
                orderDao.save(orderEntity);
                return true;
            }
        }
        return false;
    }

    public double calculateOrderTotal(List<CartItemDto> items) {
        double total = 0.0;
        for (CartItemDto item : items) {
            Optional<Book> book = bookDao.findById(item.getBookId());
            if (book.isPresent()) {
                total += book.get().getPrice() * item.getQuantity();
            }
        }
        return total;
    }

    private OrderResponse convertToOrderResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setOrderId(order.getOrderId());
        response.setOrderDate(order.getOrderDate());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        
        // Convert order items to CartItemDto with populated BookDto
        List<CartItemDto> cartItems = order.getItems().stream()
            .map(this::convertToCartItemDto)
            .collect(Collectors.toList());
        
        response.setItems(cartItems);
        return response;
    }

    private CartItemDto convertToCartItemDto(OrderItem orderItem) {
        CartItemDto cartItemDto = new CartItemDto();
        cartItemDto.setBookId(orderItem.getBook().getBookId());
        cartItemDto.setQuantity(orderItem.getQuantity());
        
        // Populate the BookDto - this is what was missing!
        BookDto bookDto = convertToBookDto(orderItem.getBook());
        cartItemDto.setBook(bookDto);
        
        return cartItemDto;
    }

    private BookDto convertToBookDto(Book book) {
        BookDto bookDto = new BookDto();
        bookDto.setBookId(book.getBookId());
        bookDto.setTitle(book.getTitle());
        bookDto.setAuthor(book.getAuthor());
        bookDto.setDescription(book.getDescription());
        bookDto.setPrice(book.getPrice());
        bookDto.setStock(book.getStock());
        bookDto.setCoverImageUrl(book.getCoverImageUrl());
        
        
        if (book.getCategory() != null) {
            CategoryDto categoryDto = new CategoryDto();
            categoryDto.setCategoryId(book.getCategory().getCategoryId());
            categoryDto.setName(book.getCategory().getName());
            // Add other category fields as needed
            bookDto.setCategory(categoryDto);
        }
        
        return bookDto;
    }
}