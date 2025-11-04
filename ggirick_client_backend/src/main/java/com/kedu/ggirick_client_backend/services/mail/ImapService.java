package com.kedu.ggirick_client_backend.services.mail;

import com.kedu.ggirick_client_backend.dao.mail.MailDAO;
import com.kedu.ggirick_client_backend.dao.mail.MailReceiverDAO;
import com.kedu.ggirick_client_backend.dto.mail.MailDTO;
import com.kedu.ggirick_client_backend.dto.mail.MailReceiverDTO;
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
    private final String imapUsername = "common@ggirick.site";
    private final String imapPassword = "commonpassword";

    public void fetchMails() throws Exception {
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

        for (Message message : messages) {
            String[] messageIds = message.getHeader("Message-ID");
            if (messageIds == null || messageIds.length == 0) continue;
            String mailUid = messageIds[0];

            if (mailDAO.existsByUidBool(mailUid)) continue;

            MailDTO mailDTO = new MailDTO();
            mailDTO.setMailUid(mailUid);
            Address[] froms = message.getFrom();
            mailDTO.setSender((froms != null && froms.length > 0) ? ((InternetAddress) froms[0]).getAddress() : "");
            mailDTO.setTitle(message.getSubject());
            mailDTO.setContent(getTextFromMessage(message));
            if (message.getReceivedDate() != null)
                mailDTO.setSentAt(new Timestamp(message.getReceivedDate().getTime()));

            mailDAO.addMail(mailDTO);
            int mailId = mailDTO.getId();

            processRecipients(message.getRecipients(Message.RecipientType.TO), mailId, 1);
            processRecipients(message.getRecipients(Message.RecipientType.CC), mailId, 2);
            processRecipients(message.getRecipients(Message.RecipientType.BCC), mailId, 3);
        }

        inbox.close(false);
        store.close();
    }

    private void processRecipients(Address[] addresses, int mailId, int typeId) throws Exception {
        if (addresses == null || addresses.length == 0) return;
        for (Address addr : addresses) {
            if (!(addr instanceof InternetAddress)) continue;
            String email = ((InternetAddress) addr).getAddress();
            MailReceiverDTO receiver = MailReceiverDTO.builder()
                    .mailId(mailId)
                    .receiver(email)
                    .typeId(typeId)
                    .statusId(1) // INBOX 기본 상태
                    .receivedAt(new Timestamp(System.currentTimeMillis()))
                    .build();
            mailReceiverDAO.addMailReceiver(receiver);
        }
    }

    private String getTextFromMessage(Message message) throws Exception {
        if (message.isMimeType("text/plain") || message.isMimeType("text/html")) {
            Object content = message.getContent();
            return content == null ? "" : content.toString();
        } else if (message.isMimeType("multipart/*")) {
            Multipart multipart = (Multipart) message.getContent();
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < multipart.getCount(); i++)
                result.append(getTextFromPart(multipart.getBodyPart(i)));
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
            for (int i = 0; i < multipart.getCount(); i++)
                result.append(getTextFromPart(multipart.getBodyPart(i)));
            return result.toString();
        }
        return "";
    }
}