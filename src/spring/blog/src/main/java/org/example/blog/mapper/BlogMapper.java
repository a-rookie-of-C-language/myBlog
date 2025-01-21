package org.example.blog.mapper;

import org.apache.ibatis.annotations.*;
import org.example.blog.utils.Blog;
import java.util.List;

@Mapper
public interface BlogMapper {
    @Select("SELECT * FROM blog ORDER BY create_time DESC")
    @Results({
        @Result(property = "createTime", column = "create_time"),
        @Result(property = "updateTime", column = "update_time"),
        @Result(property = "readCount", column = "read_count")
    })
    List<Blog> findAll();

    @Select("SELECT * FROM blog WHERE id = #{id}")
    Blog findById(Long id);

    @Select("SELECT * FROM blog WHERE category = #{category} ORDER BY create_time DESC")
    List<Blog> findByCategory(String category);

    @Update("UPDATE blog SET read_count = read_count + 1 WHERE id = #{id}")
    int incrementReadCount(Long id);

    @Select("SELECT id, title FROM blog WHERE id < #{id} ORDER BY id DESC LIMIT 1")
    Blog findPrevBlog(Long id);

    @Select("SELECT id, title FROM blog WHERE id > #{id} ORDER BY id ASC LIMIT 1")
    Blog findNextBlog(Long id);

    @Insert("INSERT INTO blog (title, description, content, category, tags, create_time, update_time, author, read_count) " +
            "VALUES (#{title}, #{description}, #{content}, #{category}, #{tags}, #{createTime}, #{updateTime}, #{author}, #{readCount})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(Blog blog);

    @Update("UPDATE blog SET title = #{title}, description = #{description}, content = #{content}, " +
            "category = #{category}, tags = #{tags}, update_time = #{updateTime} WHERE id = #{id}")
    int update(Blog blog);

    @Delete("DELETE FROM blog WHERE id = #{id}")
    int delete(Long id);
}
