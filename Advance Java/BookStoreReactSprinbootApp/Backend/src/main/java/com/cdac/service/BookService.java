package com.cdac.service;

import com.cdac.dto.AddBookDto;
import com.cdac.dto.BookDto;
import com.cdac.dto.BookRequest;

import java.util.List;

public interface BookService {
    AddBookDto createBook(BookRequest request,Long id);
    List<BookDto> getAllBooks();
    List<BookDto> getBooksByCategory(Long categoryId);
    BookDto getBookById(Long id);
    BookDto updateBook(Long id, BookRequest request);
    void deleteBook(Long id);
    List<BookDto> searchBooks(String keyword);
    List<BookDto> getBooksBySeller(String sellerEmail);
	BookDto updateStock(Long id, int stock);
	boolean isBookOwner(Long bookId, String username);
}