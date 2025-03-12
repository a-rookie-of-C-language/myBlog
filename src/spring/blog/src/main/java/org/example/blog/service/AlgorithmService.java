package org.example.blog.service;

import lombok.extern.slf4j.Slf4j;
import org.example.blog.mapper.AlgorithmMapper;
import org.example.blog.utils.Algorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
@Slf4j
public class AlgorithmService {
    @Autowired
    private AlgorithmMapper algorithmMapper;

    @Value("${algorithm.md.path}")
    private String mdPath;

    public List<Algorithm> getAllAlgorithms() {
        log.info("获取所有算法题目");
        return algorithmMapper.findAll();
    }

    public Algorithm getAlgorithmById(Long id) {
        log.info("获取算法题目，id: {}", id);
        Algorithm algorithm = algorithmMapper.findById(id);
        if (algorithm != null) {
            try {
                // 读取对应的 MD 文件内容
                String mdContent = readMdFile(id);
                algorithm.setContent(mdContent);
                // 增加阅读计数
                algorithmMapper.incrementReadCount(id);
                log.info("更新阅读计数成功");
            } catch (Exception e) {
                log.error("读取算法 MD 文件失败", e);
            }
        } else {
            log.warn("未找到算法题目，id: {}", id);
        }
        return algorithm;
    }

    public List<Algorithm> getAlgorithmsByCategory(String category) {
        log.info("获取分类算法题目，category: {}", category);
        return algorithmMapper.findByCategory(category);
    }

    private String readMdFile(Long id) throws Exception {
        // 构建 MD 文件路径
        Path filePath = Paths.get(ResourceUtils.getFile(mdPath).getPath(), id + ".md");
        if (Files.exists(filePath)) {
            return Files.readString(filePath);
        }
        throw new Exception("MD文件不存在: " + filePath);
    }
} 