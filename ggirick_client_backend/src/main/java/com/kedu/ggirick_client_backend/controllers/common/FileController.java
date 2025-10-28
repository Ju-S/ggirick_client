package com.kedu.ggirick_client_backend.controllers.common;

import com.kedu.ggirick_client_backend.services.common.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/file")
public class FileController {

    private final FileService fileService;

    /**
     * 파일 업로드
     * 예: POST /file/upload?folder=chat/images
     */
    @PostMapping(value = "/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "uploads/") String folderPath
    ) {
        try {
           Map<String, String> map = fileService.uploadFile(file, folderPath);
            return ResponseEntity.ok(map);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "파일 업로드 실패", "message", e.getMessage()));
        }
    }

    /**
     * 파일 삭제
     * 예: DELETE /file/delete?file=chat/images/abc123_filename.jpg
     */
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFile(@RequestParam("file") String sysName) {
        try {
            fileService.deleteFile(sysName); // 서비스에서 URL 또는 sysName 처리
            return ResponseEntity.ok(Map.of("message", "파일 삭제 성공"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "파일 삭제 실패", "message", e.getMessage()));
        }
    }

}