package com.cdac.dto;

import com.cdac.entities.Category;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddBookDto {
    private Long bookId;
    private String title;
    private String author;
    private String description;
    private double price;
    private int stock;
    private CategoryDto category;
}