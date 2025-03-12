package org.example.blog.service;

import lombok.extern.slf4j.Slf4j;
import org.example.blog.DTO.BlogDTO;
import org.example.blog.exception.ResourceNotFoundException;
import org.example.blog.mapper.BlogMapper;
import org.example.blog.utils.Blog;
import org.example.blog.utils.MarkdownUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;

@Service
@Slf4j
public class BlogService {
    @Value("${blog.markdown.path}")
    private Resource markdownPath;

    @Autowired
    private BlogMapper blogMapper;

    public List<Blog> getAllBlogs() {
        return blogMapper.findAll();
    }

    public List<Blog> getBlogsByCategory(String category) {
        return blogMapper.findByCategory(category);
    }

    public Blog getBlogById(Long id) {
        return blogMapper.findById(id);
    }

    public Blog getBlogWithNavigation(Long id) {
        Blog currentBlog = getBlogById(id);
        if (currentBlog != null) {
            try {
                Resource mdFile = new ClassPathResource("markdown/" + currentBlog.getDir());
                String content = new String(mdFile.getInputStream().readAllBytes());
                currentBlog.setContent(content);
                
                // 增加阅读计数
                blogMapper.incrementReadCount(id);
                
                // 获取上一篇和下一篇
                Blog prevBlog = blogMapper.findPrevBlog(id);
                Blog nextBlog = blogMapper.findNextBlog(id);
                
                currentBlog.setPrevBlog(prevBlog);
                currentBlog.setNextBlog(nextBlog);

                return currentBlog;
            } catch (IOException e) {
                log.error("读取Markdown文件失败: {}", e.getMessage());
                throw new RuntimeException("Failed to read blog content", e);
            }
        }
        return null;
    }

    @Transactional
    public Blog createBlog(BlogDTO blogDTO) {
        Blog blog = Blog.builder()
                .title(blogDTO.getTitle())
                .description(blogDTO.getDescription())
                .content(blogDTO.getContent())
                .category(blogDTO.getCategory())
                .tags(String.join(",", blogDTO.getTags()))
                .createTime(new Date())
                .updateTime(new Date())
                .author("admin") // 从安全上下文获取
                .readCount(0)
                .build();

        try {
            // 保存到数据库
            blogMapper.insert(blog);
            
            // 保存Markdown文件
            String mdFilePath = markdownPath + "/" + blog.getId() + ".md";
            MarkdownUtils.saveMarkdownFile(blog.getContent(), mdFilePath);
            
            return blog;
        } catch (IOException e) {
            log.error("Failed to save markdown file for blog", e);
            throw new RuntimeException("Failed to save blog content", e);
        }
    }

    @Transactional
    public Blog updateBlog(Long id, BlogDTO blogDTO) throws ResourceNotFoundException {
        Blog existingBlog = getBlogById(id);
        if (existingBlog == null) {
            throw new ResourceNotFoundException("Blog not found with id: " + id);
        }

        existingBlog.setTitle(blogDTO.getTitle());
        existingBlog.setDescription(blogDTO.getDescription());
        existingBlog.setContent(blogDTO.getContent());
        existingBlog.setCategory(blogDTO.getCategory());
        existingBlog.setTags(String.join(",", blogDTO.getTags()));
        existingBlog.setUpdateTime(new Date());

        try {
            // 更新数据库
            blogMapper.update(existingBlog);
            
            // 更新Markdown文件
            String mdFilePath = markdownPath + "/" + id + ".md";
            MarkdownUtils.saveMarkdownFile(existingBlog.getContent(), mdFilePath);
            
            return existingBlog;
        } catch (IOException e) {
            log.error("Failed to update markdown file for blog", e);
            throw new RuntimeException("Failed to update blog content", e);
        }
    }

    @Transactional
    public void deleteBlog(Long id) throws ResourceNotFoundException {
        Blog blog = getBlogById(id);
        if (blog == null) {
            throw new ResourceNotFoundException("Blog not found with id: " + id);
        }
        
        // 删除数据库记录
        blogMapper.delete(id);
        
        // 删除Markdown文件
        try {
            java.nio.file.Files.deleteIfExists(
                java.nio.file.Paths.get(markdownPath + "/" + id + ".md")
            );
        } catch (IOException e) {
            log.error("Failed to delete markdown file for blog id: {}", id, e);
            // 不抛出异常，因为数据库记录已经删除
        }
    }

    public BlogDTO parseMarkdownContent(String content) {
        BlogDTO blogDTO = new BlogDTO();
        
        // 解析 frontmatter
        if (content.startsWith("---")) {
            String[] parts = content.split("---", 3);
            if (parts.length >= 3) {
                // 解析 frontmatter
                String frontmatter = parts[1].trim();
                String[] lines = frontmatter.split("\n");
                Map<String, String> metadata = new HashMap<>();
                
                for (String line : lines) {
                    String[] kv = line.split(":", 2);
                    if (kv.length == 2) {
                        metadata.put(kv[0].trim(), kv[1].trim());
                    }
                }
                
                // 设置博客信息
                blogDTO.setTitle(metadata.getOrDefault("title", ""));
                blogDTO.setDescription(metadata.getOrDefault("description", ""));
                blogDTO.setCategory(metadata.getOrDefault("category", ""));
                
                // 处理标签
                String tags = metadata.get("tags");
                if (tags != null) {
                    blogDTO.setTags(Arrays.asList(
                        tags.replaceAll("[\\[\\]]", "")
                            .split(",\\s*")
                    ));
                }
                
                // 设置内容
                blogDTO.setContent(parts[2].trim());
            }
        } else {
            // 如果没有 frontmatter，将整个内容作为博客内容
            blogDTO.setContent(content);
        }
        
        return blogDTO;
    }
}
