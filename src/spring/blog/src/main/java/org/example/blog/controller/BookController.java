package org.example.blog.controller;

import org.example.blog.utils.Book;
import org.example.blog.utils.Result;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @GetMapping("")
    public Result<List<Book>> getAllBooks() {
        try {
            Book book1 = new Book();
            book1.setId(1L);
            book1.setTitle("深入理解Java虚拟机");
            book1.setAuthor("周志明");
            book1.setDescription("这本书深入讲解了Java虚拟机的原理，包括内存模型、垃圾回收、类加载机制等核心概念。对于想要深入理解Java运行机制的开发者来说是一本必读的书籍。");
            book1.setCoverUrl("/books/jvm.jpg");

            Book book2 = new Book();
            book2.setId(2L);
            book2.setTitle("算法（第4版）");
            book2.setAuthor("Robert Sedgewick / Kevin Wayne");
            book2.setDescription("这本书使用Java语言详细讲解了各种基础算法和数据结构，配有大量的示例和练习，是一本非常适合系统学习算法的教材。");
            book2.setCoverUrl("/books/algorithms.jpg");

            Book book3 = new Book();
            book3.setId(3L);
            book3.setTitle("JavaScript高级程序设计");
            book3.setAuthor("Nicholas C. Zakas");
            book3.setDescription("这本书全面介绍了JavaScript语言的各个方面，从基础概念到高级应用，是前端开发者的必备参考书。");
            book3.setCoverUrl("/books/js.jpg");

            List<Book> books = Arrays.asList(book1, book2, book3);
            return Result.success(books);
        } catch (Exception e) {
            return Result.error("获取书籍列表失败");
        }
    }
} 