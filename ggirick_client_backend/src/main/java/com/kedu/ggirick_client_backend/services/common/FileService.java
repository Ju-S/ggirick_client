package com.kedu.ggirick_client_backend.services.common;

import com.kedu.ggirick_client_backend.utils.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class FileService {

    private final FileUtil fileUtil;

    /**
     * 파일 업로드 후 GCS 공개 URL 반환
     *
     * @param file 업로드할 파일
     * @param folderPath 업로드할 경로 (예: "chat/images/" or "workspace/icons/")
     * @return GCS 공개 URL
     */
    public String uploadFile(MultipartFile file, String folderPath) throws Exception {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 존재하지 않습니다.");
        }

        return fileUtil.uploadAndGetUrl(file.getOriginalFilename(), folderPath, file);
    }
}