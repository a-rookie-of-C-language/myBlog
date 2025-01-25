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
public class Algorithm {
    private Long id;
    private String title;
    private String description;
    private String content;
    private String category;
    private String difficulty;
    private String timeComplexity;
    private String spaceComplexity;
    private Date createTime;
    private Date updateTime;
    private Integer readCount;
    private String dir;
    private String solution;
} 