package org.example.blog.service;

import lombok.extern.slf4j.Slf4j;
import org.example.blog.mapper.AlgorithmMapper;
import org.example.blog.utils.Algorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class AlgorithmService {
    @Autowired
    private AlgorithmMapper algorithmMapper;

    public List<Algorithm> getAllAlgorithms() {
        return algorithmMapper.findAll();
    }

    public Algorithm getAlgorithmById(Long id) {
        Algorithm algorithm = algorithmMapper.findById(id);
        if (algorithm != null) {
            // 增加阅读计数
            algorithmMapper.incrementReadCount(id);
        }
        return algorithm;
    }

    public List<Algorithm> getAlgorithmsByCategory(String category) {
        return algorithmMapper.findByCategory(category);
    }
} 