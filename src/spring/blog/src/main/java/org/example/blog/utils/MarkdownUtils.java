package org.example.blog.utils;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.File;

public class MarkdownUtils {
    
    public static String readMarkdownFile(String filePath) throws IOException {
        File file = new File(filePath);
        if (!file.exists()) {
            throw new IOException("Markdown file not found: " + filePath + 
                " (Absolute path: " + file.getAbsolutePath() + ")");
        }
        return Files.readString(file.toPath());
    }
    
    public static void saveMarkdownFile(String content, String filePath) throws IOException {
        Path path = Paths.get(filePath);
        // 确保目录存在
        Files.createDirectories(path.getParent());
        Files.writeString(path, content);
    }
} 