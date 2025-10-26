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
import java.util.*;

@Service
@RequiredArgsConstructor
public class ImapService {
    private final MailDAO mailDAO;
    private final MailReceiverDAO mailReceiverDAO;

    public void fetchMails() throws Exception{

        String host = "192.168.45.24";
        String username = "test1@ggirick.site";
        String password = "test1";

        Properties props = new Properties();
        props.put("mail.store.protocol", "imap");
        props.put("mail.imap.host", host);
        props.put("mail.imap.port", "143");

        Session session = Session.getDefaultInstance(props);
        Store store = session.getStore("imap"); // imaps → imap (143 포트일 경우)
        store.connect(host, username, password);

        Folder inbox = store.getFolder("INBOX");
        inbox.open(Folder.READ_ONLY);

        Message[] messages = inbox.getMessages();

        for (Message message : messages) {

            //  Mail 저장
            MailDTO mailDTO = new MailDTO();
            mailDTO.setSender(((InternetAddress) message.getFrom()[0]).getAddress());
            mailDTO.setTitle(message.getSubject());
            mailDTO.setContent(getTextFromMessage(message));
            mailDTO.setStatus(3); // 안읽음
            mailDTO.setSentAt(new java.sql.Timestamp(message.getReceivedDate().getTime()));
            System.out.println("보낸시간 : "+mailDTO.getSentAt());
            mailDAO.addMail(mailDTO); // insert 후 mail.getId() 세팅됨

            // MailReceiver 저장
            MailReceiverDTO receiver = new MailReceiverDTO();
            receiver.setMailId(mailDTO.getId());
            receiver.setReceiver(username); // 본인 계정
            receiver.setTypeId(1);          // To
            receiver.setStatusId(3);        // 안읽음
            receiver.setReceivedAt(new java.sql.Timestamp(message.getReceivedDate().getTime()));

            mailReceiverDAO.addMailReceiver(receiver);
        }

        inbox.close(false);
        store.close();

    }

    /**
     * 메일 본문 텍스트를 재귀적으로 추출
     */
    private String getTextFromMessage(Message message) throws Exception {
        if (message.isMimeType("text/plain")) {
            return message.getContent().toString();
        } else if (message.isMimeType("multipart/*")) {
            Multipart multipart = (Multipart) message.getContent();
            StringBuilder result = new StringBuilder();
            for (int i = 0; i < multipart.getCount(); i++) {
                BodyPart part = multipart.getBodyPart(i);
                result.append(getTextFromPart(part));
            }
            return result.toString();
        }
        return "";
    }

    private String getTextFromPart(Part part) throws Exception {
        if (part.isMimeType("text/plain")) {
            return part.getContent().toString();
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