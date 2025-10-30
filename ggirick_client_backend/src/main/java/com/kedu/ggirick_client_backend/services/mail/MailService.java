package com.kedu.ggirick_client_backend.services.mail;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender MailSender;

    public void sendMailTest(){
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("test1@ggirick.site");
        message.setFrom("test2@ggirick.site");
        message.setSubject("제발 마지막 테스트..");
        message.setText("제에발...");
        MailSender.send(message);
    }
}
