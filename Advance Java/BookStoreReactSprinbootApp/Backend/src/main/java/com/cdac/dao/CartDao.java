package com.cdac.dao;

import com.cdac.entities.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartDao extends JpaRepository<Cart, Long> {

    /**
     * Find cart by user ID
     */
    Optional<Cart> findByUser_UserId(Long userId);

    /**
     * Check if cart exists for user
     */
    boolean existsByUser_UserId(Long userId);

    /**
     * Find all carts with items
     */
    @Query("SELECT DISTINCT c FROM Cart c WHERE c.items IS NOT EMPTY")
    List<Cart> findCartsWithItems();

    /**
     * Find empty carts
     */
    @Query("SELECT c FROM Cart c WHERE c.items IS EMPTY")
    List<Cart> findEmptyCarts();


    /**
     * Find cart with total value calculation
     */
    @Query("SELECT c, SUM(ci.quantity * ci.book.price) as totalValue " +
           "FROM Cart c LEFT JOIN c.items ci " +
           "WHERE c.user.userId = :userId " +
           "GROUP BY c")
    Object[] findCartWithTotalByUserId(@Param("userId") Long userId);

    /**
     * Count total items in user's cart
     */
    @Query("SELECT SUM(ci.quantity) FROM CartItem ci WHERE ci.cart.user.userId = :userId")
    Long countItemsInUserCart(@Param("userId") Long userId);

    /**
     * Delete cart by user ID
     */
    void deleteByUser_UserId(Long userId);

    /**
     * Find carts by user email
     */
    @Query("SELECT c FROM Cart c WHERE c.user.email = :email")
    Optional<Cart> findByUserEmail(@Param("email") String email);
}