package com.kedu.ggirick_client_backend.controllers.board;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Storage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/board/{boardId}/file")
@RequiredArgsConstructor
public class BoardFileController {
    private final Storage storage;

    @Value("${spring.cloud.gcp.storage.bucket}")
    private String bucketName;

    // 파일 다운로드
    @GetMapping("/{sysname}")
    public ResponseEntity<byte[]> download(@PathVariable String sysname) {
        Blob blob = storage.get(bucketName, sysname);

        byte[] content = blob.getContent();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", new String(sysname.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1));
        return new ResponseEntity<>(content, headers, HttpStatus.OK);
    }

    // 선택된 파일 삭제
    // DB및 GCP에서 삭제

}
