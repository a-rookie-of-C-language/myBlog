package org.example.blog.mapper;

import org.apache.ibatis.annotations.*;
import org.example.blog.utils.Algorithm;
import java.util.List;

@Mapper
public interface AlgorithmMapper {
    @Select("SELECT * FROM Algorithm ORDER BY createTime DESC")
    @Results({
        @Result(property = "createTime", column = "createTime"),
        @Result(property = "updateTime", column = "updateTime"),
        @Result(property = "readCount", column = "readCount"),
        @Result(property = "timeComplexity", column = "timeComplexity"),
        @Result(property = "spaceComplexity", column = "spaceComplexity")
    })
    List<Algorithm> findAll();

    @Select("SELECT * FROM Algorithm WHERE id = #{id}")
    Algorithm findById(Long id);

    @Select("SELECT * FROM Algorithm WHERE category = #{category} ORDER BY createTime DESC")
    List<Algorithm> findByCategory(String category);

    @Update("UPDATE Algorithm SET readCount = readCount + 1 WHERE id = #{id}")
    int incrementReadCount(Long id);
} 