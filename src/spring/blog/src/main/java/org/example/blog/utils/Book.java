package org.example.blog.utils;

import lombok.Data;

@Data
public class Book {
    private Long id;
    private String title;
    private String author;
    private String description;
    private String coverUrl;
}
