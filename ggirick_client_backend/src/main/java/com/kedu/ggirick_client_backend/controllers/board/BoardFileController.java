package com.kedu.ggirick_client_backend.controllers.board;

import com.google.cloud.storage.Storage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/board/{boardId}/file")
@RequiredArgsConstructor
public class BoardFileController {
    private final Storage storage;

    @Value("${spring.cloud.gcp.storage.bucket}")
    private String bucketName;

    // 선택된 파일 삭제
    // DB및 GCP에서 삭제

}
