package com.cdac.dao;

import com.cdac.entities.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemDao extends JpaRepository<CartItem, Long> {

    /**
     * Find all cart items for a specific cart
     */
    List<CartItem> findByCart_CartId(Long cartId);

    /**
     * Find cart item by cart ID and book ID
     */
    Optional<CartItem> findByCart_CartIdAndBook_BookId(Long cartId, Long bookId);

    /**
     * Find all cart items for a specific user
     */
    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.user.userId = :userId")
    List<CartItem> findByUserId(@Param("userId") Long userId);

    /**
     * Find cart item by user ID and book ID
     */
    @Query("SELECT ci FROM CartItem ci WHERE ci.cart.user.userId = :userId AND ci.book.bookId = :bookId")
    Optional<CartItem> findByUserIdAndBookId(@Param("userId") Long userId, @Param("bookId") Long bookId);

    /**
     * Count items in a specific cart
     */
    Long countByCart_CartId(Long cartId);

    /**
     * Calculate total quantity for a user's cart
     */
    @Query("SELECT SUM(ci.quantity) FROM CartItem ci WHERE ci.cart.user.userId = :userId")
    Long getTotalQuantityByUserId(@Param("userId") Long userId);

    /**
     * Calculate total value for a user's cart
     */
    @Query("SELECT SUM(ci.quantity * ci.book.price) FROM CartItem ci WHERE ci.cart.user.userId = :userId")
    Double getTotalValueByUserId(@Param("userId") Long userId);

    /**
     * Find cart items by book ID (to check which users have this book in cart)
     */
    List<CartItem> findByBook_BookId(Long bookId);

    /**
     * Delete all cart items for a specific cart
     */
    @Modifying
    @Transactional
    void deleteByCart_CartId(Long cartId);

    /**
     * Delete cart item by user ID and book ID
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM CartItem ci WHERE ci.cart.user.userId = :userId AND ci.book.bookId = :bookId")
    void deleteByUserIdAndBookId(@Param("userId") Long userId, @Param("bookId") Long bookId);

    /**
     * Update quantity of cart item
     */
    @Modifying
    @Transactional
    @Query("UPDATE CartItem ci SET ci.quantity = :quantity WHERE ci.cart.user.userId = :userId AND ci.book.bookId = :bookId")
    int updateQuantityByUserIdAndBookId(@Param("userId") Long userId, @Param("bookId") Long bookId, @Param("quantity") Integer quantity);

    /**
     * Find cart items with low stock books
     */
    @Query("SELECT ci FROM CartItem ci WHERE ci.book.stock < ci.quantity")
    List<CartItem> findItemsWithInsufficientStock();

    /**
     * Find cart items by category
     */
    @Query("SELECT ci FROM CartItem ci WHERE ci.book.category.categoryId = :categoryId")
    List<CartItem> findByBookCategory(@Param("categoryId") Long categoryId);

    /**
     * Find cart items with books above a certain price
     */
    @Query("SELECT ci FROM CartItem ci WHERE ci.book.price > :price")
    List<CartItem> findByBookPriceGreaterThan(@Param("price") Double price);

    /**
     * Check if book exists in user's cart
     */
    boolean existsByCart_User_UserIdAndBook_BookId(Long userId, Long bookId);
}