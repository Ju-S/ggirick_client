package com.kedu.ggirick_client_backend.controllers.mail;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.mail.MailDTO;
import com.kedu.ggirick_client_backend.dto.mail.MailSendDTO;
import com.kedu.ggirick_client_backend.services.mail.MailFetchService;
import com.kedu.ggirick_client_backend.services.mail.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mail")
public class MailController {

    private final MailService mServ;
    private final MailFetchService mfServ;

    @PostMapping("/send")
    public ResponseEntity<Void> sendMail(@ModelAttribute MailSendDTO mailSendDTO,
                                         @AuthenticationPrincipal UserTokenDTO userToken) throws Exception {
        mailSendDTO.setEmployeeId(userToken.getId());
        mServ.sendMail(mailSendDTO);
        return ResponseEntity.ok().build();
    }

    // folder endpoints: /mail/{folder}?email=...
    @GetMapping("/{folder}")
    public List<MailDTO> getMails(@PathVariable String folder, @RequestParam String email) {
        return mfServ.fetchUserMails(folder, email);
    }

    // 상세
    @GetMapping("/detail/{id}")
    public MailDTO getMailDetail(@PathVariable int id) {
        return mfServ.fetchMailDetail(id);
    }

    // 수신자 상태 변경 (메일을 휴지통/스팸/중요로 이동)
    @PostMapping("/receiver/status")
    public ResponseEntity<?> changeReceiverStatus(@RequestBody Map<String, Object> body) {
        // 이렇게 옴: { "mailId":123, "email":"a@b", "statusId": 5 }
        Integer mailId = (Integer) body.get("mailId");
        String email = (String) body.get("email");
        Integer statusId = (Integer) body.get("statusId");
        if (mailId == null || email == null || statusId == null) {
            return ResponseEntity.badRequest().body("missing params");
        }
        int updated = mServ.updateReceiverStatusByMailIdAndEmail(mailId, email, statusId);
        return ResponseEntity.ok(Map.of("updated", updated));
    }

    // 수신자 row 영구 삭제 (휴지통에서 완전 삭제)
    @DeleteMapping("/receiver/{receiverId}")
    public ResponseEntity<?> deleteReceiver(@PathVariable int receiverId) {
        int deleted = mServ.deleteReceiverRow(receiverId);
        return ResponseEntity.ok(Map.of("deleted", deleted));
    }
}