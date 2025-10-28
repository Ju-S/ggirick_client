package com.kedu.ggirick_client_backend.controllers.approval;

import com.kedu.ggirick_client_backend.dto.approval.ApprovalFilesDTO;
import com.kedu.ggirick_client_backend.dto.board.BoardFileDTO;
import com.kedu.ggirick_client_backend.services.approval.ApprovalFilesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/approval/files")
@RequiredArgsConstructor
public class ApprovalFilesController {
    private final ApprovalFilesService approvalFilesService;

    // 파일 다운로드
    @GetMapping
    public ResponseEntity<byte[]> download(@RequestParam String sysname,
                                           @RequestParam String oriname) {
        byte[] content = approvalFilesService.downloadFile(sysname);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", new String(oriname.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1));
        return new ResponseEntity<>(content, headers, HttpStatus.OK);
    }

    // 선택된 파일 삭제
    // DB및 GCP에서 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable int id) {
        ApprovalFilesDTO targetFile = approvalFilesService.getFileById(id);
        approvalFilesService.deleteFile(targetFile);
        return ResponseEntity.ok().build();
    }
}
