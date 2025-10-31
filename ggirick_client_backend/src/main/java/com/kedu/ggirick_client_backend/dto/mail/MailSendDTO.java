package com.kedu.ggirick_client_backend.dto.mail;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MailSendDTO {
    private String employeeId; // 발신자 사번
    private String sender; // 이메일

    private String to;  // "test1;test2" → list로 변환
    private String cc;
    private String bcc;

    private String subject;
    private String content;
    private LocalDateTime sendAt;

    private List<MultipartFile> attachment; // 업로드 파일
    private Map<String,String> fileUrlMap = new HashMap<>();

    private List<String> toList;
    private List<String> ccList;
    private List<String> bccList;
    private int scheduled;
    private int id; // DB insert용
}