package com.kedu.ggirick_client_backend.controllers.board;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Storage;
import com.kedu.ggirick_client_backend.dto.board.BoardFileDTO;
import com.kedu.ggirick_client_backend.services.board.BoardFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/board/file")
@RequiredArgsConstructor
public class BoardFileController {
    private final BoardFileService boardFileService;

    // 파일 다운로드
    @GetMapping
    public ResponseEntity<byte[]> download(@RequestParam String sysname,
                                           @RequestParam String oriname) {
        byte[] content = boardFileService.downloadFile(sysname);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", new String(oriname.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1));
        return new ResponseEntity<>(content, headers, HttpStatus.OK);
    }

    // 선택된 파일 삭제
    // DB및 GCP에서 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable int id) {
        BoardFileDTO targetFile = boardFileService.getFileById(id);
        boardFileService.deleteFile(targetFile);
        return ResponseEntity.ok().build();
    }
}
