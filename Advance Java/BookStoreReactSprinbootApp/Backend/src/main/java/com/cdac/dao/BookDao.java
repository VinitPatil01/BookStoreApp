package com.cdac.dao;

import com.cdac.entities.Book;
import com.cdac.entities.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookDao extends JpaRepository<Book, Long> {
	List<Book> findByCategoryCategoryId(Long categoryId);
    List<Book> findByTitleContainingIgnoreCase(String keyword);
    List<Book> findBySeller_UserId(Long sellerId);
    
}
