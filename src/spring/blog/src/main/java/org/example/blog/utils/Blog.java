package org.example.blog.utils;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Blog {
    private Long id;
    private String title;
    private String description;
    private String content;
    private String category;
    private String tags;
    private Date createTime;
    private Date updateTime;
    private String author;
    private Integer readCount;
    private String dir;
    
    // 添加导航字段
    private Blog prevBlog;
    private Blog nextBlog;
}
