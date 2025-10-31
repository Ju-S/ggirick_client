package com.kedu.ggirick_client_backend.services.mail;

import com.kedu.ggirick_client_backend.dao.mail.MailDAO;
import com.kedu.ggirick_client_backend.dao.mail.MailReceiverDAO;
import com.kedu.ggirick_client_backend.dto.mail.MailDTO;
import com.kedu.ggirick_client_backend.dto.mail.MailReceiverDTO;
import com.kedu.ggirick_client_backend.utils.mail.MailUtil;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Properties;

@Service
@RequiredArgsConstructor
public class ImapService {
    private final MailDAO mailDAO;
    private final MailReceiverDAO mailReceiverDAO;

    private final String imapHost = "10.5.5.2";
    private final int imapPort = 143;

    private final String imapUsername = "test1@ggirick.site";
    private final String imapPassword = "test1";

    public void fetchMails() throws Exception {
        System.out.println("📩 IMAP 메일 수신 시작...");

        Properties props = new Properties();
        props.put("mail.store.protocol", "imap");
        props.put("mail.imap.host", imapHost);
        props.put("mail.imap.port", String.valueOf(imapPort));

        Session session = Session.getDefaultInstance(props);
        Store store = session.getStore("imap");
        store.connect(imapHost, imapUsername, imapPassword);

        Folder inbox = store.getFolder("INBOX");
        inbox.open(Folder.READ_ONLY);

        Message[] messages = inbox.getMessages();
        System.out.println("✅ 수신된 메일 수: " + messages.length);

        for (Message message : messages) {
            try {
                String[] messageIds = message.getHeader("Message-ID");
                if (messageIds == null || messageIds.length == 0) {
                    System.out.println("❌ Message-ID 없음. 스킵");
                    continue;
                }
                String mailUid = messageIds[0];
                System.out.println("\n-------------------------------");
                System.out.println("📌 Message-ID: " + mailUid);

                if (mailDAO.existsByUid(mailUid)) {
                    System.out.println("⏩ 이미 저장된 메일. 스킵");
                    continue;
                }

                MailDTO mailDTO = new MailDTO();
                mailDTO.setMailUid(mailUid);

                Address[] froms = message.getFrom();
                String sender = (froms != null && froms.length > 0) ? ((InternetAddress) froms[0]).getAddress() : "";
                mailDTO.setSender(sender);
                System.out.println("👤 From: " + sender);

                mailDTO.setTitle(message.getSubject());

                String content = getTextFromMessage(message);
                if (content == null || content.isBlank()) content = "(본문 없음)";
                mailDTO.setContent(content);

                mailDTO.setStatus(3); // 안읽음
                if (message.getReceivedDate() != null) {
                    mailDTO.setSentAt(new Timestamp(message.getReceivedDate().getTime()));
                }

                // DB insert
                mailDAO.addMail(mailDTO);
                int mailId = mailDTO.getId();
                System.out.println("💾 메일 저장됨! mailId=" + mailId);

                // recipients: store local-part only
                processRecipients(message.getRecipients(Message.RecipientType.TO), mailId, 1);
                processRecipients(message.getRecipients(Message.RecipientType.CC), mailId, 2);
                processRecipients(message.getRecipients(Message.RecipientType.BCC), mailId, 3);

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        inbox.close(false);
        store.close();
        System.out.println("✅ 메일 수신 종료");
    }

    private void processRecipients(Address[] addresses, int mailId, int typeId) {
        if (addresses == null || addresses.length == 0) return;

        for (Address addr : addresses) {
            if (!(addr instanceof InternetAddress)) continue;
            String email = ((InternetAddress) addr).getAddress();
            System.out.println("📍 원본 수신자: " + email);
            String local = MailUtil.extractLocalPart(email);
            System.out.println("📍 DB에 저장할 local-part: " + local);

            MailReceiverDTO receiver = new MailReceiverDTO();
            receiver.setMailId(mailId);
            receiver.setReceiver(local); // local-part 저장
            receiver.setTypeId(typeId);
            receiver.setStatusId(3);
            receiver.setReceivedAt(new Timestamp(System.currentTimeMillis()));

            mailReceiverDAO.addMailReceiver(receiver);
        }
    }

    // getTextFromMessage / getTextFromPart (기존 코드 그대로)...
    private String getTextFromMessage(Message message) throws Exception {
        if (message.isMimeType("text/plain") || message.isMimeType("text/html")) {
            Object content = message.getContent();
            return content == null ? "" : content.toString();
        } else if (message.isMimeType("multipart/*")) {
            Multipart multipart = (Multipart) message.getContent();
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < multipart.getCount(); i++) {
                result.append(getTextFromPart(multipart.getBodyPart(i)));
            }
            return result.toString();
        }
        return "";
    }

    private String getTextFromPart(Part part) throws Exception {
        if (part.isMimeType("text/plain") || part.isMimeType("text/html")) {
            Object content = part.getContent();
            return content == null ? "" : content.toString();
        } else if (part.isMimeType("multipart/*")) {
            Multipart multipart = (Multipart) part.getContent();
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < multipart.getCount(); i++) {
                result.append(getTextFromPart(multipart.getBodyPart(i)));
            }
            return result.toString();
        }
        return "";
    }
}