package org.example.blog.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import org.example.blog.service.BlogService;
import org.example.blog.utils.Blog;
import org.example.blog.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/blogs")
@Slf4j
public class BlogController {
    @Autowired
    private BlogService blogService;


    @GetMapping
    public Result<List<Blog>> getAllBlogs() {
        try {
            List<Blog> blogs = blogService.getAllBlogs();
            log.info("获取到的博客列表: {}", blogs);
            if (blogs == null || blogs.isEmpty()) {
                return Result.error("没有找到博客数据");
            }
            return Result.success(blogs);
        } catch (Exception e) {
            log.error("获取博客列表失败", e);
            return Result.error("获取博客列表失败: " + e.getMessage());
        }
    }

    @GetMapping("/category/{category}")
    public Result<PageInfo<Blog>> getBlogsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageHelper.startPage(page, size);
        List<Blog> blogs = blogService.getBlogsByCategory(category);
        PageInfo<Blog> pageInfo = new PageInfo<>(blogs);
        return Result.success(pageInfo);
    }

    @GetMapping("/{id}")
    public Result<Blog> getBlogById(@PathVariable Long id) {
        return Result.success(blogService.getBlogWithNavigation(id));
    }

    @GetMapping("/{id}/content")
    public Result<String> getBlogContent(@PathVariable Long id) {
        try {
            Blog blog = blogService.getBlogWithNavigation(id);
            if (blog == null) {
                return Result.error("博客不存在");
            }
            
            String content = blog.getContent();
            
            if (content == null || content.isEmpty()) {
                return Result.error("博客内容不存在");
            }
            
            return Result.success(content);
        } catch (Exception e) {
            log.error("获取博客内容失败", e);
            return Result.error("获取博客内容失败: " + e.getMessage());
        }
    }
}
