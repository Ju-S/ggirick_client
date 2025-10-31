package com.kedu.ggirick_client_backend.services.mail;

import com.kedu.ggirick_client_backend.dao.mail.MailDAO;
import com.kedu.ggirick_client_backend.dto.mail.MailReceiverDTO;
import com.kedu.ggirick_client_backend.dto.mail.MailSendDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MailSchedulerService {

    private final MailDAO mailDAO;
    private final MailService mailService;


    @Scheduled(fixedRate = 10000) // 10초마다
    public void sendScheduledMails() {
        List<MailSendDTO> mails = mailDAO.getScheduledMails();

        for (MailSendDTO mail : mails) {
            try {
                List<MailReceiverDTO> receivers = mailDAO.getMailReceivers(mail.getId());

                mailService.sendMailWithCommonSmtp(mail, receivers);

                mailDAO.markAsSent(mail.getId());
                System.out.println("✅ 예약 메일 발송 성공: " + mail.getSubject());

            } catch (Exception e) {
                System.out.println("❌ 예약 메일 발송 실패: " + mail.getSubject());
                e.printStackTrace();
            }
        }
    }
}

