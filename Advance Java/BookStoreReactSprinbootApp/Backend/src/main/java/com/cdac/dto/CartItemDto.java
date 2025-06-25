package com.cdac.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class CartItemDto {
	private Long bookId;
	private BookDto book;
	private int quantity;
}