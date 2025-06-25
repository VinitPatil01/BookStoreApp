package com.cdac.dao;

import com.cdac.entities.Order;
import com.cdac.entities.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderDao extends JpaRepository<Order, Long> {

    /**
     * Find orders by user ID ordered by date descending
     */
    List<Order> findByUser_UserIdOrderByOrderDateDesc(Long userId);

    /**
     * Find order by order ID and user ID (for security)
     */
    Optional<Order> findByOrderIdAndUser_UserId(Long orderId, Long userId);

    /**
     * Find all orders ordered by date descending
     */
    List<Order> findAllByOrderByOrderDateDesc();

    /**
     * Find orders by status
     */
    List<Order> findByStatusOrderByOrderDateDesc(OrderStatus status);

    /**
     * Find orders by user ID and status
     */
    List<Order> findByUser_UserIdAndStatusOrderByOrderDateDesc(Long userId, OrderStatus status);

    /**
     * Find orders between dates
     */
    List<Order> findByOrderDateBetweenOrderByOrderDateDesc(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find orders with pagination
     */
    Page<Order> findByUser_UserIdOrderByOrderDateDesc(Long userId, Pageable pageable);

    /**
     * Find orders with total amount greater than specified value
     */
    List<Order> findByTotalAmountGreaterThanOrderByOrderDateDesc(Double amount);

    /**
     * Count orders by user ID
     */
    Long countByUser_UserId(Long userId);

    /**
     * Count orders by status
     */
    Long countByStatus(OrderStatus status);

    /**
     * Find recent orders (last N days)
     */
    @Query("SELECT o FROM Order o WHERE o.orderDate >= :date ORDER BY o.orderDate DESC")
    List<Order> findRecentOrders(@Param("date") LocalDateTime date);

    /**
     * Find orders by user email
     */
    @Query("SELECT o FROM Order o WHERE o.user.email = :email ORDER BY o.orderDate DESC")
    List<Order> findByUserEmail(@Param("email") String email);

    /**
     * Calculate total revenue between dates
     */
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate AND o.status != 'CANCELLED'")
    Double calculateRevenueBetweenDates(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Find top customers by order count
     */
    @Query("SELECT o.user.userId, o.user.email, COUNT(o) as orderCount FROM Order o GROUP BY o.user.userId, o.user.email ORDER BY orderCount DESC")
    List<Object[]> findTopCustomersByOrderCount();

    /**
     * Find top customers by total spent
     */
    @Query("SELECT o.user.userId, o.user.email, SUM(o.totalAmount) as totalSpent FROM Order o WHERE o.status != 'CANCELLED' GROUP BY o.user.userId, o.user.email ORDER BY totalSpent DESC")
    List<Object[]> findTopCustomersByTotalSpent();

    /**
     * Find orders containing a specific book
     */
    @Query("SELECT DISTINCT o FROM Order o JOIN o.items oi WHERE oi.book.bookId = :bookId")
    List<Order> findOrdersContainingBook(@Param("bookId") Long bookId);

    /**
     * Find orders by shipping address containing text
     */
    List<Order> findByShippingAddressContainingIgnoreCaseOrderByOrderDateDesc(String addressText);

    /**
     * Calculate average order value
     */
    @Query("SELECT AVG(o.totalAmount) FROM Order o WHERE o.status != 'CANCELLED'")
    Double calculateAverageOrderValue();

    /**
     * Find orders that can be cancelled (PENDING or CONFIRMED status)
     */
    @Query("SELECT o FROM Order o WHERE o.status IN ('PENDING', 'CONFIRMED') ORDER BY o.orderDate DESC")
    List<Order> findCancellableOrders();

    /**
     * Find orders by user ID and date range
     */
    @Query("SELECT o FROM Order o WHERE o.user.userId = :userId AND o.orderDate BETWEEN :startDate AND :endDate ORDER BY o.orderDate DESC")
    List<Order> findByUserIdAndDateRange(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Get monthly sales report
     */
    @Query("SELECT YEAR(o.orderDate), MONTH(o.orderDate), COUNT(o), SUM(o.totalAmount) FROM Order o WHERE o.status != 'CANCELLED' GROUP BY YEAR(o.orderDate), MONTH(o.orderDate) ORDER BY YEAR(o.orderDate) DESC, MONTH(o.orderDate) DESC")
    List<Object[]> getMonthlySalesReport();

    /**
     * Find orders needing attention (old pending orders)
     */
    @Query("SELECT o FROM Order o WHERE o.status = 'PENDING' AND o.orderDate < :date ORDER BY o.orderDate ASC")
    List<Order> findPendingOrdersOlderThan(@Param("date") LocalDateTime date);
}