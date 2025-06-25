package com.cdac.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BookRequest {
    @NotBlank
    private String title;

    @NotBlank
    private String author;

    private String description;

    @NotNull
    private double price;

    @NotNull
    private int stock;

    @NotNull
    private Long categoryId;
    @NotNull
    private String coverImageUrl;
}