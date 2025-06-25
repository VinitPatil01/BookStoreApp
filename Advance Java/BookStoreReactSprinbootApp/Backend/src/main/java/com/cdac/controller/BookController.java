package com.cdac.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.cdac.dto.AddBookDto;
import com.cdac.dto.BookDto;
import com.cdac.dto.BookRequest;
import com.cdac.dto.UserResp;
import com.cdac.entities.User;
import com.cdac.security.JwtUtils;
import com.cdac.service.BookService;
import com.cdac.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BookController {
	private final JwtUtils jwtUtils;
    private final BookService bookService;
    private final UserService userService;

    // PUBLIC ENDPOINTS - No authentication required
    
    /**
     * Get all books - Public access for browsing
     */
    @GetMapping("/public")
    public ResponseEntity<List<BookDto>> getAllBooksPublic() {
        List<BookDto> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }

    /**
     * Get book by ID - Public access
     */
    @GetMapping("/public/{id}")
    public ResponseEntity<BookDto> getBookByIdPublic(@PathVariable Long id) {
        BookDto book = bookService.getBookById(id);
        return ResponseEntity.ok(book);
    }

    /**
     * Search books - Public access
     */
    @GetMapping("/public/search")
    public ResponseEntity<List<BookDto>> searchBooksPublic(@RequestParam String keyword) {
        List<BookDto> books = bookService.searchBooks(keyword);
        return ResponseEntity.ok(books);
    }

    /**
     * Get books by category - Public access
     */
    @GetMapping("/public/category/{categoryId}")
    public ResponseEntity<List<BookDto>> getBooksByCategoryPublic(@PathVariable Long categoryId) {
        List<BookDto> books = bookService.getBooksByCategory(categoryId);
        return ResponseEntity.ok(books);
    }

    // SELLER ENDPOINTS - Only sellers can manage their books

    /**
     * Create a new book - Only SELLER
     */
    @PostMapping("/seller")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<AddBookDto> createBook(
            @Valid @RequestBody BookRequest request,
            Authentication authentication) {
        
        String email = authentication.getName(); // safer way than casting
        System.out.println("email "+email);
        UserResp user = userService.getUserByEmail(email);
        System.out.println("user "+user);
        Long userId = user.getUserId();
        System.out.println("userId "+userId);
        AddBookDto createdBook = bookService.createBook(request, userId);
        
        return new ResponseEntity<>(createdBook, HttpStatus.CREATED);
    }

    /**
     * Get seller's own books
     */
    @GetMapping("/seller/my-books")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<List<BookDto>> getMyBooks(Authentication authentication) {
    	String sellerEmail = authentication.getName();
        List<BookDto> books = bookService.getBooksBySeller(sellerEmail);
        return ResponseEntity.ok(books);
    }

    /**
     * Update book - Only book owner (seller) can update
     */
    @PutMapping("/seller/{id}")
    @PreAuthorize("hasRole('SELLER') and @bookService.isBookOwner(#id, authentication.name)")
    public ResponseEntity<BookDto> updateBook(@PathVariable Long id, 
                                            @Valid @RequestBody BookRequest request) {
        BookDto updatedBook = bookService.updateBook(id, request);
        return ResponseEntity.ok(updatedBook);
    }

    /**
     * Delete book - Only book owner can delete
     */
    @DeleteMapping("/seller/{id}")
    @PreAuthorize("hasRole('SELLER') and @bookService.isBookOwner(#id, authentication.name)")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id, Authentication authentication) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Update book stock - Seller only
     */
    @PatchMapping("/seller/{id}/stock")
    @PreAuthorize("hasRole('SELLER') and @bookService.isBookOwner(#id, authentication.name)")
    public ResponseEntity<BookDto> updateStock(@PathVariable Long id, @RequestParam int stock) {
        BookDto updatedBook = bookService.updateStock(id, stock);
        return ResponseEntity.ok(updatedBook);
    }

    // BUYER ENDPOINTS - Authenticated buyers

    /**
     * Get all books - Authenticated access with detailed info
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER')")
    public ResponseEntity<List<BookDto>> getAllBooks() {
        List<BookDto> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }

    /**
     * Check book availability - Authenticated users
     */
    @GetMapping("/{id}/availability")
    @PreAuthorize("hasAnyRole('BUYER', 'SELLER')")
    public ResponseEntity<Boolean> checkAvailability(@PathVariable Long id) {
        try {
            BookDto book = bookService.getBookById(id);
            boolean available = book.getStock() > 0;
            return ResponseEntity.ok(available);
        } catch (Exception e) {
            return ResponseEntity.ok(false);
        }
    }

    // ADMIN ENDPOINTS - Full access

    /**
     * Admin: Get all books with full details
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookDto>> getAllBooksAdmin() {
    	List<BookDto> books = bookService.getAllBooks();
        return ResponseEntity.ok(books);
    }

    /**
     * Admin: Force delete any book
     */
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> adminDeleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Admin: Get books by seller
     */
    @GetMapping("/admin/seller/{sellerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BookDto>> getBooksBySellerId(@PathVariable String sellerEmail) {
    	List<BookDto> books = bookService.getBooksBySeller(sellerEmail);
        return ResponseEntity.ok(books);
    }
}