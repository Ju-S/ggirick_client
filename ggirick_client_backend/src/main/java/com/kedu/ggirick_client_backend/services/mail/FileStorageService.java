package com.kedu.ggirick_client_backend.services.mail;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${mail.attachment.upload-dir:uploads}") // 기본 폴더 uploads
    private String uploadDir;

    @Value("${mail.attachment.base-url:http://localhost:8080/files/}") // 브라우저 접근용 URL prefix
    private String baseUrl;

    /**
     * 여러 파일 저장하고 URL map 반환
     */
    public Map<String, String> storeFiles(MultipartFile[] files) throws IOException {
        Map<String, String> fileUrlMap = new HashMap<>();
        if (files == null) return fileUrlMap;

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String storedFileName = storeFile(file);
            String url = baseUrl + storedFileName;
            fileUrlMap.put(file.getOriginalFilename(), url);
        }
        return fileUrlMap;
    }

    /**
     * 단일 파일 저장
     */
    public String storeFile(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);

        // 폴더 없으면 생성
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 파일명 충돌 방지
        String extension = "";
        String originalName = file.getOriginalFilename();
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }
        String storedFileName = UUID.randomUUID().toString() + extension;

        // 파일 저장
        Path filePath = uploadPath.resolve(storedFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return storedFileName;
    }
}