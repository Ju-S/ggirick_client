package com.kedu.ggirick_client_backend.utils;

import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class FileUtil {

    private final Storage storage;

    @Value("${spring.cloud.gcp.storage.bucket}")
    private String bucketName;

    // 파일 업로드(실제 저장된 파일명을 반환
    public String fileUpload(String oriName, MultipartFile file) throws Exception {
        String sysName = UUID.randomUUID() + "_" + oriName;
        BlobInfo blobInfo =
                BlobInfo.newBuilder(BlobId.of(bucketName, sysName))
                        .setContentType(file.getContentType())
                        .build();

        try (InputStream is = file.getInputStream()) {
            storage.createFrom(blobInfo, is);
        }

        return sysName;
    }

    // 파일 다운로드
    public byte[] fileDownload(String sysName) {
        Blob blob = storage.get(bucketName, sysName);
        return blob.getContent();
    }
}