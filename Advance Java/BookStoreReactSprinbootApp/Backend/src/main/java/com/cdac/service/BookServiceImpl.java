package com.cdac.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cdac.custom_exceptions.NotFoundException;
import com.cdac.dao.BookDao;
import com.cdac.dao.CategoryDao;
import com.cdac.dao.UserDao;
import com.cdac.dto.AddBookDto;
import com.cdac.dto.BookDto;
import com.cdac.dto.BookRequest;
import com.cdac.entities.Book;
import com.cdac.entities.Category;
import com.cdac.entities.User;

import lombok.RequiredArgsConstructor;

@Service("bookService")
@Transactional
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookDao bookDao;
    private final CategoryDao categoryDao;
    private final UserDao userDao;
    private final ModelMapper mapper;

    @Override
    public AddBookDto createBook(BookRequest request,Long id) {
        Category category = categoryDao.findById(request.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Category not found"));

        Book book = mapper.map(request, Book.class);
        book.setCategory(category);
        User seller = userDao.findById(id).orElseThrow(()->new NotFoundException("user not found"));
        book.setSeller(seller);
        return mapper.map(bookDao.save(book), AddBookDto.class);
    }

    @Override
    public List<BookDto> getAllBooks() {
        return bookDao.findAll().stream()
                .map(book -> mapper.map(book, BookDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<BookDto> getBooksByCategory(Long categoryId) {
        return bookDao.findByCategoryCategoryId(categoryId).stream()
                .map(book -> mapper.map(book, BookDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public BookDto getBookById(Long id) {
        Book book = bookDao.findById(id)
                .orElseThrow(() -> new NotFoundException("Book not found"));
        return mapper.map(book, BookDto.class);
    }

    @Override
    public BookDto updateBook(Long id, BookRequest request) {
        Book book = bookDao.findById(id)
                .orElseThrow(() -> new NotFoundException("Book not found"));

        Category category = categoryDao.findById(request.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Category not found"));

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setDescription(request.getDescription());
        book.setPrice(request.getPrice());
        book.setStock(request.getStock());
        book.setCategory(category);

        return mapper.map(bookDao.save(book), BookDto.class);
    }

    @Override
    public void deleteBook(Long id) {
        if (!bookDao.existsById(id))
            throw new NotFoundException("Book not found with ID: " + id);
        bookDao.deleteById(id);
    }

    @Override
    public List<BookDto> searchBooks(String keyword) {
        return bookDao.findByTitleContainingIgnoreCase(keyword).stream()
                .map(book -> mapper.map(book, BookDto.class))
                .collect(Collectors.toList());
    }

	@Override
	public List<BookDto> getBooksBySeller(String sellerEmail) {
		User seller = userDao.findByEmail(sellerEmail).orElseThrow(()-> new NotFoundException("Seller with " + sellerEmail + " not found" ));
		Long  SellerId = seller.getUserId();
		List<Book> books = bookDao.findBySeller_UserId(SellerId);
		List<BookDto> dto = books.stream().map((book)->mapper.map(book, BookDto.class)).collect(Collectors.toList());
		return dto;
	}

	@Override
	public BookDto updateStock(Long id, int stock) {
		Book bk = bookDao.findById(id).orElseThrow(()->new NotFoundException("Book not found!"));
		bk.setStock(stock);
		return mapper.map(bookDao.save(bk), BookDto.class );
	}

	    @Override
	    public boolean isBookOwner(Long bookId, String username) {
	    	System.out.println("in seller");
	        Optional<Book> bookOpt = bookDao.findById(bookId);
	        return bookOpt.map(book -> book.getSeller().getEmail().equals(username)).orElse(false);
	    }
	}
