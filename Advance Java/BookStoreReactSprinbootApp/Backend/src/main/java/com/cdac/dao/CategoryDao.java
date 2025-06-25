package com.cdac.dao;

import com.cdac.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryDao extends JpaRepository<Category, Long> {

    /**
     * Find category by name (case-insensitive)
     */
    Optional<Category> findByNameIgnoreCase(String name);

    /**
     * Find category by exact name
     */
    Optional<Category> findByName(String name);

    /**
     * Check if category exists by name
     */
    boolean existsByName(String name);

    /**
     * Find categories containing the given text in name or description
     */
    @Query("SELECT c FROM Category c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :searchText, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :searchText, '%'))")
    List<Category> findByNameOrDescriptionContaining(@Param("searchText") String searchText);

    /**
     * Find all categories ordered by name
     */
    List<Category> findAllByOrderByNameAsc();

    /**
     * Find categories that have books
     */
    @Query("SELECT DISTINCT c FROM Category c WHERE c.books IS NOT EMPTY")
    List<Category> findCategoriesWithBooks();

    /**
     * Find categories that have no books
     */
    @Query("SELECT c FROM Category c WHERE c.books IS EMPTY")
    List<Category> findCategoriesWithoutBooks();

    /**
     * Count books in a category
     */
    @Query("SELECT COUNT(b) FROM Book b WHERE b.category.categoryId = :categoryId")
    Long countBooksByCategory(@Param("categoryId") Long categoryId);
}