//package com.kedu.ggirick_client_backend.services.mail;
//
//import com.kedu.ggirick_client_backend.dao.mail.MailDAO;
//import com.kedu.ggirick_client_backend.dto.mail.MailSendDTO;
//import com.kedu.ggirick_client_backend.dto.mail.MailReceiverDTO;
//import lombok.RequiredArgsConstructor;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class MailSchedulerService {
//
//    private final MailDAO mailDAO;
//    private final MailService mailService;
//
//    @Scheduled(fixedRate = 10000) // 10초마다 체크
//    public void sendScheduledMails() {
//        List<MailSendDTO> mails = mailDAO.getScheduledMails();
//
//        for (MailSendDTO mail : mails) {
//            try {
//                // ✅ 제목 null 방지
//                if (mail.getSubject() == null || mail.getSubject().isBlank()) {
//                    mail.setSubject("(제목 없음)");
//                }
//
//                List<MailReceiverDTO> receivers = mailDAO.getMailReceivers(mail.getId());
//
//                mailService.sendMailWithCommonSmtp(mail, receivers);
//
//                // 1️⃣ 발송 완료 시 scheduled=0
//                mailDAO.markAsSent(mail.getId());
//
//                // 2️⃣ 발송 완료 시간 기록
//                mailDAO.updateSentAt(mail.getId(), LocalDateTime.now());
//
//                System.out.println("✅ 예약 메일 발송 성공: " + mail.getSubject());
//
//            } catch (Exception e) {
//                System.err.println("❌ 예약 메일 발송 실패: " + mail.getSubject() + " / ID: " + mail.getId());
//                e.printStackTrace();
//
//                // 실패하더라도 다음 예약메일 계속 시도
//                continue;
//            }
//        }
//    }
//}