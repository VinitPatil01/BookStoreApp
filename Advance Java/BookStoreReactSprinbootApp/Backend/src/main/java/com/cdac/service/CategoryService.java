package com.cdac.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cdac.custom_exceptions.NotFoundException;
import com.cdac.dao.CategoryDao;
import com.cdac.dto.BookDto;
import com.cdac.dto.CategoryDto;
import com.cdac.dto.CategoryRequestDto;
import com.cdac.dto.CategoryWithBooksDto;
import com.cdac.entities.Category;

import jakarta.validation.Valid;



@Service
@Transactional
public class CategoryService {

    @Autowired
    private CategoryDao categoryDao;
    @Autowired
    private ModelMapper modelMapper;

    public List<CategoryDto> getAllCategories() {
        List<Category> categories = categoryDao.findAll();
        return categories.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public CategoryWithBooksDto getCategoryById(Long id) {
        Category category = categoryDao.findById(id).orElseThrow(()->  new NotFoundException("category not found"));
        CategoryWithBooksDto dto = new CategoryWithBooksDto();
        dto.setCategoryId(category.getCategoryId());
        dto.setName(category.getName());
        List<BookDto> bookDtos = category.getBooks().stream()
        	    .map(book -> {
        	        BookDto bookDto = modelMapper.map(book, BookDto.class);
        	        CategoryDto categoryDto = new CategoryDto();
        	        categoryDto.setCategoryId(category.getCategoryId());
        	        categoryDto.setName(category.getName());
        	        bookDto.setCategory(categoryDto);
        	        return bookDto;
        	    }).collect(Collectors.toList());
        dto.setBooks(bookDtos);
        return dto;
    }

    public CategoryRequestDto createCategory(@Valid CategoryRequestDto categoryDto) {
        Category category = modelMapper.map(categoryDto, Category.class);
        Category savedCategory = categoryDao.save(category);
        
        return convertToRequestDto(savedCategory);
    }

    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) {
        Category existingCategory = categoryDao.findById(id).orElseThrow(()-> new NotFoundException("category not found"));
        System.out.println(categoryDto);
        if (existingCategory!=null) {
        	existingCategory.setName(categoryDto.getName());
        	existingCategory.setDescription(categoryDto.getDescription());
            Category updatedCategory = categoryDao.save(existingCategory);
            
            return convertToDto(updatedCategory);
        }
        return null;
    }

    public boolean deleteCategory(Long id) {
        if (categoryDao.existsById(id)) {
            categoryDao.deleteById(id);
            return true;
        }
        return false;
    }

    public CategoryWithBooksDto getCategoryByName(String name) {
        Category category = categoryDao.findByName(name).orElseThrow(()->  new NotFoundException("category not found"));
        CategoryWithBooksDto dto = new CategoryWithBooksDto();
        dto.setCategoryId(category.getCategoryId());
        dto.setName(category.getName());
        List<BookDto> bookDtos = category.getBooks().stream()
        	    .map(book -> {
        	        BookDto bookDto = modelMapper.map(book, BookDto.class);
        	        CategoryDto categoryDto = new CategoryDto();
        	        categoryDto.setCategoryId(category.getCategoryId());
        	        categoryDto.setName(category.getName());
        	        bookDto.setCategory(categoryDto);
        	        return bookDto;
        	    }).collect(Collectors.toList());
        dto.setBooks(bookDtos);
        return dto;
    }

    private CategoryRequestDto convertToRequestDto(Category category) {
    	CategoryRequestDto dto = new CategoryRequestDto();
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        return dto;
    }
    
    private CategoryDto convertToDto(Category category) {
    	CategoryDto dto = new CategoryDto();
    	dto.setCategoryId(category.getCategoryId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        return dto;
    }

    private Category convertToEntity(CategoryDto dto) {
        Category category = new Category();
        category.setName(dto.getName());
        return category;
    }
}