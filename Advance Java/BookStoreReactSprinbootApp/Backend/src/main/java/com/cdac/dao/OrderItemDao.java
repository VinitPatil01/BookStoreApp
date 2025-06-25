package com.cdac.dao;

import com.cdac.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderItemDao extends JpaRepository<OrderItem, Long> {

    /**
     * Find order items by order ID
     */
    List<OrderItem> findByOrder_OrderId(Long orderId);

    /**
     * Find order items by book ID
     */
    List<OrderItem> findByBook_BookId(Long bookId);

    /**
     * Find order items by user ID (through order)
     */
    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.user.userId = :userId")
    List<OrderItem> findByUserId(@Param("userId") Long userId);

    /**
     * Calculate total quantity sold for a book
     */
    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi WHERE oi.book.bookId = :bookId AND oi.order.status != 'CANCELLED'")
    Long getTotalQuantitySoldForBook(@Param("bookId") Long bookId);

    /**
     * Calculate total revenue for a book
     */
    @Query("SELECT SUM(oi.quantity * oi.priceAtPurchase) FROM OrderItem oi WHERE oi.book.bookId = :bookId AND oi.order.status != 'CANCELLED'")
    Double getTotalRevenueForBook(@Param("bookId") Long bookId);

    /**
     * Find best selling books
     */
    @Query("SELECT oi.book.bookId, oi.book.title, SUM(oi.quantity) as totalSold FROM OrderItem oi WHERE oi.order.status != 'CANCELLED' GROUP BY oi.book.bookId, oi.book.title ORDER BY totalSold DESC")
    List<Object[]> findBestSellingBooks();

    /**
     * Find order items by date range
     */
    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.orderDate BETWEEN :startDate AND :endDate AND oi.order.status != 'CANCELLED'")
    List<OrderItem> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Find order items by category
     */
    @Query("SELECT oi FROM OrderItem oi WHERE oi.book.category.categoryId = :categoryId AND oi.order.status != 'CANCELLED'")
    List<OrderItem> findByBookCategory(@Param("categoryId") Long categoryId);

    /**
     * Calculate category-wise sales
     */
    @Query("SELECT oi.book.category.name, SUM(oi.quantity), SUM(oi.quantity * oi.priceAtPurchase) FROM OrderItem oi WHERE oi.order.status != 'CANCELLED' GROUP BY oi.book.category.categoryId, oi.book.category.name ORDER BY SUM(oi.quantity * oi.priceAtPurchase) DESC")
    List<Object[]> getCategoryWiseSales();

    /**
     * Find order items with quantity greater than specified
     */
    List<OrderItem> findByQuantityGreaterThan(Integer quantity);

    /**
     * Find order items by price range
     */
    @Query("SELECT oi FROM OrderItem oi WHERE oi.priceAtPurchase BETWEEN :minPrice AND :maxPrice")
    List<OrderItem> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);

    /**
     * Find recent purchases of a book
     */
    @Query("SELECT oi FROM OrderItem oi WHERE oi.book.bookId = :bookId AND oi.order.orderDate >= :date ORDER BY oi.order.orderDate DESC")
    List<OrderItem> findRecentPurchasesOfBook(@Param("bookId") Long bookId, @Param("date") LocalDateTime date);

    /**
     * Find user's purchase history for a specific book
     */
    @Query("SELECT oi FROM OrderItem oi WHERE oi.order.user.userId = :userId AND oi.book.bookId = :bookId ORDER BY oi.order.orderDate DESC")
    List<OrderItem> findUserPurchaseHistoryForBook(@Param("userId") Long userId, @Param("bookId") Long bookId);

    /**
     * Count distinct books purchased by user
     */
    @Query("SELECT COUNT(DISTINCT oi.book.bookId) FROM OrderItem oi WHERE oi.order.user.userId = :userId AND oi.order.status != 'CANCELLED'")
    Long countDistinctBooksPurchasedByUser(@Param("userId") Long userId);

    /**
     * Find items with price difference (current price vs purchase price)
     */
    @Query("SELECT oi FROM OrderItem oi WHERE ABS(oi.priceAtPurchase - oi.book.price) > :threshold")
    List<OrderItem> findItemsWithPriceDifference(@Param("threshold") Double threshold);

    /**
     * Get daily sales report
     */
    @Query("SELECT DATE(oi.order.orderDate), SUM(oi.quantity), SUM(oi.quantity * oi.priceAtPurchase) FROM OrderItem oi WHERE oi.order.status != 'CANCELLED' AND oi.order.orderDate BETWEEN :startDate AND :endDate GROUP BY DATE(oi.order.orderDate) ORDER BY DATE(oi.order.orderDate) DESC")
    List<Object[]> getDailySalesReport(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Find items that were purchased multiple times by same user
     */
    @Query("SELECT oi.book.bookId, oi.book.title, oi.order.user.userId, COUNT(oi) FROM OrderItem oi WHERE oi.order.status != 'CANCELLED' GROUP BY oi.book.bookId, oi.book.title, oi.order.user.userId HAVING COUNT(oi) > 1")
    List<Object[]> findRepeatPurchases();
}