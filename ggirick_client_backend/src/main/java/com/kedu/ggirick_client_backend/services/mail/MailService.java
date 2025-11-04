package com.kedu.ggirick_client_backend.services.mail;

import com.kedu.ggirick_client_backend.dao.mail.MailDAO;
import com.kedu.ggirick_client_backend.dto.mail.MailSendDTO;
import com.kedu.ggirick_client_backend.services.hr.EmployeeService;
import jakarta.activation.DataHandler;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.util.ByteArrayDataSource;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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


    public void sendMail(MailSendDTO dto) throws Exception {
        dto.setToList(toEmailList(dto.getTo()));
        dto.setCcList(toEmailList(dto.getCc()));
        dto.setBccList(toEmailList(dto.getBcc()));

        if ((dto.getToList() == null || dto.getToList().isEmpty())
                && (dto.getCcList() == null || dto.getCcList().isEmpty())
                && (dto.getBccList() == null || dto.getBccList().isEmpty())) {
            throw new IllegalArgumentException("수신자가 없습니다.");
        }

        if (dto.getAttachment() != null && !dto.getAttachment().isEmpty()) {
            Map<String, String> fileUrlMap = fileStorageService.storeFiles(dto.getAttachment().toArray(new MultipartFile[0]));
            dto.setFileUrlMap(fileUrlMap);
        }

        String sender = dto.getSender();
        if (sender == null || sender.isBlank()) {
            String email = employeeService.getEmployeeInfo(dto.getEmployeeId()).getEmail();
            sender = (email != null && !email.isBlank()) ? email : smtpAuthEmail;
        }
        if (!sender.contains("@")) sender += fromDomain;
        dto.setSender(sender);

        if (dto.getSubject() == null || dto.getSubject().isBlank()) dto.setSubject("(제목 없음)");

        // SMTP 전송
        sendViaSmtp(dto);

        // DB 저장
        dto.setScheduled(0);
        mailDAO.sendMail(dto);
        mailDAO.insertReceivers(dto);
        mailDAO.sendAttachments(dto);
    }

    private void sendViaSmtp(MailSendDTO dto) throws Exception {
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

        if (dto.getToList() != null && !dto.getToList().isEmpty())
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(String.join(",", dto.getToList())));
        if (dto.getCcList() != null && !dto.getCcList().isEmpty())
            message.setRecipients(Message.RecipientType.CC, InternetAddress.parse(String.join(",", dto.getCcList())));
        if (dto.getBccList() != null && !dto.getBccList().isEmpty())
            message.setRecipients(Message.RecipientType.BCC, InternetAddress.parse(String.join(",", dto.getBccList())));

        message.setSubject(dto.getSubject(), "UTF-8");

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
        Transport.send(message);
    }

    // status 변경: mail_receiver의 status_id 변경 (폴더이동)
    public int updateReceiverStatusByMailIdAndEmail(int mailId, String email, int statusId) {
        Map<String,Object> p = new HashMap<>();
        p.put("mailId", mailId);
        p.put("email", email);
        p.put("statusId", statusId);
        return mailDAO.updateReceiverStatus(p);
    }

    // 수신자 row(메일-수신자) 완전 삭제 — 휴지통에서 영구삭제시 사용
    public int deleteReceiverRow(int receiverId) {
        return mailDAO.deleteMailReceiver(receiverId);
    }

    private List<String> toEmailList(String raw) {
        if (raw == null || raw.isBlank()) return Collections.emptyList();
        String[] parts = raw.split("[,;\\s]+");
        List<String> out = new ArrayList<>();
        for (String p : parts) {
            if (p.isBlank()) continue;
            p = p.trim();
            out.add(p.contains("@") ? p : p + fromDomain);
        }
        return out;
    }
}