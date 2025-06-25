package com.cdac.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CategoryWithBooksDto {
	private Long categoryId;
    private String name;
    private List<BookDto> books;
}
