package com.kedu.ggirick_client_backend.services.mail;

import com.kedu.ggirick_client_backend.dao.mail.MailDAO;
import com.kedu.ggirick_client_backend.dto.mail.MailSendDTO;
import com.kedu.ggirick_client_backend.dto.mail.MailReceiverDTO;
import com.kedu.ggirick_client_backend.services.hr.EmployeeService;
import com.kedu.ggirick_client_backend.utils.mail.MailUtil;
import jakarta.activation.DataHandler;
import jakarta.mail.*;
import jakarta.mail.internet.*;
import jakarta.mail.util.ByteArrayDataSource;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class MailService {

    private final MailDAO mailDAO;
    private final EmployeeService employeeService;
    private final FileStorageService fileStorageService;

    @Value("${spring.mail.host}") private String smtpHost;
    @Value("${spring.mail.port}") private int smtpPort;
    @Value("${spring.mail.username}") private String smtpAuthEmail;
    @Value("${spring.mail.password}") private String smtpAuthPassword;
    @Value("${mail.smtp.from-domain:@ggirick.site}") private String fromDomain;

    /**
     * 즉시발송 및 예약발송 통합 메서드
     */
    public void sendMailWithCommonSmtp(MailSendDTO dto) throws Exception {

        // 1️⃣ 수신자 리스트 처리
        List<String> toList = toEmailList(dto.getTo());
        List<String> ccList = toEmailList(dto.getCc());
        List<String> bccList = toEmailList(dto.getBcc());
        dto.setToList(toList);
        dto.setCcList(ccList);
        dto.setBccList(bccList);

        if (toList.isEmpty() && ccList.isEmpty() && bccList.isEmpty()) {
            throw new IllegalArgumentException("수신자가 없습니다.");
        }

        // 2️⃣ 첨부파일 저장
        if (dto.getAttachment() != null && !dto.getAttachment().isEmpty()) {
            Map<String, String> fileUrlMap = fileStorageService.storeFiles(
                    dto.getAttachment().toArray(new MultipartFile[0])
            );
            dto.setFileUrlMap(fileUrlMap);
        }

        // 3️⃣ 발신자 설정
        if (dto.getSender() == null || dto.getSender().isBlank()) {
            String email = employeeService.getEmployeeInfo(dto.getEmployeeId()).getEmail();
            dto.setSender(email != null ? email : "unknown" + fromDomain);
        }

        // 4️⃣ 제목 null 방지
        if (dto.getSubject() == null || dto.getSubject().isBlank()) {
            dto.setSubject("(제목 없음)");
        }

        // 5️⃣ 예약메일이면 DB 저장 후 종료
        if (dto.getSendAt() != null && dto.getSendAt().isAfter(LocalDateTime.now())) {
            scheduleMail(dto);
            return;
        }

        // 6️⃣ SMTP 세션
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "false");
        props.put("mail.smtp.ssl.enable", "false");
        props.put("mail.smtp.host", smtpHost);
        props.put("mail.smtp.port", String.valueOf(smtpPort));

        Session session = Session.getInstance(props, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(smtpAuthEmail, smtpAuthPassword);
            }
        });

        MimeMessage message = new MimeMessage(session);
        message.setFrom(new InternetAddress(dto.getSender()));

        if (!toList.isEmpty()) message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(String.join(",", toList)));
        if (!ccList.isEmpty()) message.setRecipients(Message.RecipientType.CC, InternetAddress.parse(String.join(",", ccList)));
        if (!bccList.isEmpty()) message.setRecipients(Message.RecipientType.BCC, InternetAddress.parse(String.join(",", bccList)));

        message.setSubject(dto.getSubject());

        // 7️⃣ 본문 + 첨부파일
        MimeMultipart multipart = new MimeMultipart();
        MimeBodyPart htmlPart = new MimeBodyPart();
        htmlPart.setContent(dto.getContent() != null ? dto.getContent() : "", "text/html; charset=UTF-8");
        multipart.addBodyPart(htmlPart);

        if (dto.getAttachment() != null) {
            for (MultipartFile file : dto.getAttachment()) {
                MimeBodyPart filePart = new MimeBodyPart();
                filePart.setFileName(file.getOriginalFilename());
                String type = file.getContentType() != null ? file.getContentType() : "application/octet-stream";
                filePart.setDataHandler(new DataHandler(new ByteArrayDataSource(file.getInputStream(), type)));
                multipart.addBodyPart(filePart);
            }
        }
        message.setContent(multipart);

        // 8️⃣ SMTP 발송
        Transport.send(message);

        // 9️⃣ DB 저장
        dto.setScheduled(0);
        mailDAO.sendMail(dto);
        mailDAO.insertReceivers(dto);
        mailDAO.sendAttachments(dto);
    }

    /**
     * 예약 메일 DB 저장
     */
    private void scheduleMail(MailSendDTO dto) {
        dto.setScheduled(1);
        mailDAO.sendMail(dto);
        mailDAO.insertReceivers(dto);
        mailDAO.sendAttachments(dto);
        System.out.println("예약메일 저장됨: " + dto.getSender());
    }

    /**
     * 문자열 → 이메일 리스트 변환
     */
    private List<String> toEmailList(String raw) {
        if (raw == null || raw.isBlank()) return Collections.emptyList();
        String[] parts = raw.split("[,;\\s]+");
        List<String> out = new ArrayList<>();
        for (String p : parts) {
            String s = MailUtil.normalize(p);
            if (!s.isEmpty()) out.add(s.contains("@") ? s : MailUtil.toFullEmail(s));
        }
        return out;
    }

    /**
     * 예약용 오버로딩 (ReceiverDTO 리스트를 받아 DTO 세팅 후 기존 메서드 재사용)
     */
    public void sendMailWithCommonSmtp(MailSendDTO dto, List<MailReceiverDTO> receivers) throws Exception {
        List<String> toList = receivers.stream()
                .filter(r -> r.getTypeId() == 1)
                .map(MailReceiverDTO::getReceiver)
                .toList();

        List<String> ccList = receivers.stream()
                .filter(r -> r.getTypeId() == 2)
                .map(MailReceiverDTO::getReceiver)
                .toList();

        List<String> bccList = receivers.stream()
                .filter(r -> r.getTypeId() == 3)
                .map(MailReceiverDTO::getReceiver)
                .toList();

        dto.setTo(String.join(",", toList));
        dto.setCc(String.join(",", ccList));
        dto.setBcc(String.join(",", bccList));

        sendMailWithCommonSmtp(dto);
    }
}