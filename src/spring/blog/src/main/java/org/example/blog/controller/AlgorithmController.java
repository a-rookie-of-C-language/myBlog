package org.example.blog.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import lombok.extern.slf4j.Slf4j;
import org.example.blog.service.AlgorithmService;
import org.example.blog.utils.Algorithm;
import org.example.blog.utils.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/algorithms")
@Slf4j
public class AlgorithmController {
    @Autowired
    private AlgorithmService algorithmService;

    @GetMapping
    public Result<List<Algorithm>> getAllAlgorithms() {
        try {
            List<Algorithm> algorithms = algorithmService.getAllAlgorithms();
            if (algorithms == null || algorithms.isEmpty()) {
                return Result.error("没有找到算法数据");
            }
            return Result.success(algorithms);
        } catch (Exception e) {
            log.error("获取算法列表失败", e);
            return Result.error("获取算法列表失败: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public Result<Algorithm> getAlgorithmById(@PathVariable String id) {
        try {
            if (id == null || "undefined".equals(id)) {
                return Result.error("无效的算法ID");
            }
            Long algorithmId = Long.parseLong(id);
            Algorithm algorithm = algorithmService.getAlgorithmById(algorithmId);
            if (algorithm == null) {
                return Result.error("未找到对应的算法");
            }
            return Result.success(algorithm);
        } catch (NumberFormatException e) {
            log.error("无效的算法ID格式: {}", id);
            return Result.error("无效的算法ID格式");
        } catch (Exception e) {
            log.error("获取算法详情失败", e);
            return Result.error("获取算法详情失败: " + e.getMessage());
        }
    }

    @GetMapping("/category/{category}")
    public Result<PageInfo<Algorithm>> getAlgorithmsByCategory(
            @PathVariable String category,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            PageHelper.startPage(page, size);
            List<Algorithm> algorithms = algorithmService.getAlgorithmsByCategory(category);
            PageInfo<Algorithm> pageInfo = new PageInfo<>(algorithms);
            return Result.success(pageInfo);
        } catch (Exception e) {
            log.error("获取分类算法列表失败", e);
            return Result.error("获取分类算法列表失败: " + e.getMessage());
        }
    }
} 