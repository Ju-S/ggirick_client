package com.kedu.ggirick_client_backend.controllers.mail;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.mail.MailSendDTO;
import com.kedu.ggirick_client_backend.services.mail.MailService;
import com.kedu.ggirick_client_backend.utils.EncryptUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mail")
public class MailController {

    private final MailService mServ;

    @PostMapping("/send")
    public ResponseEntity<Void> sendMail(@ModelAttribute MailSendDTO mailSendDTO,
                                         @AuthenticationPrincipal UserTokenDTO userToken) throws Exception {
        // 로그인 유저 ID 세팅
        mailSendDTO.setEmployeeId(userToken.getId());

        // 실제 전송 로직은 서비스에서 처리
        mServ.sendMailWithCommonSmtp(mailSendDTO);

        return ResponseEntity.ok().build();
    }
}