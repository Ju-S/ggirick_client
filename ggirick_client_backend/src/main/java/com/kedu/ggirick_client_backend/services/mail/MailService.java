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
        message.setFrom("test1@ggirick.site");
        message.setSubject("Test Mail");
        message.setText("This is a test mail");
        MailSender.send(message);
    }
}
