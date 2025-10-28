package com.kedu.ggirick_client_backend.controllers.mail;

import com.kedu.ggirick_client_backend.services.mail.ImapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mail")
public class ImapController {
    private final ImapService imapServ;

    @PostMapping("/receive")
    public ResponseEntity<?> receiveAndSaveMails(){
        try {
            imapServ.fetchMails();
            return ResponseEntity.ok("메일 수신 및 DB 저장 완료!");
        } catch(Exception e) {
            e.printStackTrace(); // 콘솔에 스택트레이스 출력
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("메일 수신 실패: " + e.getMessage());
        }
    }
}
