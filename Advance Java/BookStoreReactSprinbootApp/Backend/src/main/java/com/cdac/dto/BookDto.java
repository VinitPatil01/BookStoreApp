package com.cdac.dto;


import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BookDto {
    private Long bookId;
    private String title;
    private String author;
    private String description;
    private double price;
    private int stock;
    private CategoryDto category;
    private String coverImageUrl;
}