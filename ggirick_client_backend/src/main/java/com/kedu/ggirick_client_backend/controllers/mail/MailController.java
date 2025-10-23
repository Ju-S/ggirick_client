package com.kedu.ggirick_client_backend.controllers.mail;

import com.kedu.ggirick_client_backend.services.mail.MailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mail")
public class MailController {
    private final MailService mServ;

    @GetMapping("/send-test")
    public String sendTest(){
        mServ.sendMailTest();
        return "메일발송완뇽";
    }
}
