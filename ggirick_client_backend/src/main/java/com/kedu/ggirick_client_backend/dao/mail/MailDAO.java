package com.kedu.ggirick_client_backend.dao.mail;

import com.kedu.ggirick_client_backend.dto.mail.MailDTO;
import com.kedu.ggirick_client_backend.dto.mail.MailSendDTO;
import com.kedu.ggirick_client_backend.dto.mail.MailReceiverDTO;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class MailDAO {

    private final SqlSession mybatis;

    public boolean existsByUid(String mailUid) {
        Integer result = mybatis.selectOne("Mail.existsByUid", mailUid);
        return result != null && result == 1;
    }
    // 1) IMAP 수신용 메일 insert
    public int addMail(MailDTO mailDTO) {
        return mybatis.insert("Mail.addMail", mailDTO);
    }

    // 1) 발신 메일 저장
    public int sendMail(MailSendDTO mailSendDTO) {
        return mybatis.insert("Mail.sendMail", mailSendDTO);
    }

    // 2) 수신자 저장 (TO/CC/BCC)
    public int insertReceivers(MailSendDTO mailSendDTO) {
        int count = 0;

        for (String to : mailSendDTO.getToList()) {
            MailReceiverDTO r = MailReceiverDTO.builder()
                    .mailId(mailSendDTO.getId())
                    .receiver(to)  // local-part
                    .typeId(1)
                    .statusId(3)   // unread
                    .build();
            count += mybatis.insert("Mail.insertReceiver", r);
        }

        for (String cc : mailSendDTO.getCcList()) {
            MailReceiverDTO r = MailReceiverDTO.builder()
                    .mailId(mailSendDTO.getId())
                    .receiver(cc)
                    .typeId(2)
                    .statusId(3)
                    .build();
            count += mybatis.insert("Mail.insertReceiver", r);
        }

        for (String bcc : mailSendDTO.getBccList()) {
            MailReceiverDTO r = MailReceiverDTO.builder()
                    .mailId(mailSendDTO.getId())
                    .receiver(bcc)
                    .typeId(3)
                    .statusId(3)
                    .build();
            count += mybatis.insert("Mail.insertReceiver", r);
        }

        return count;
    }

    // 3) 첨부파일 저장
    public int sendAttachments(MailSendDTO mailSendDTO) {
        System.out.println("Mail ID = " + mailSendDTO.getId());
        System.out.println("FileUrlMap = " + mailSendDTO.getFileUrlMap());
        int count = 0;
        if (mailSendDTO.getFileUrlMap() != null) {
            for (Map.Entry<String, String> e : mailSendDTO.getFileUrlMap().entrySet()) {
                mybatis.insert("Mail.sendAttachmentsSingle", Map.of(
                        "filename", e.getKey(),
                        "fileUrl", e.getValue(),
                        "mailId", mailSendDTO.getId()
                ));
                count++;
            }
        }
        return count;
    }

    // 예약 발송용 메일 조회
    public List<MailSendDTO> getScheduledMails() {
        return mybatis.selectList("Mail.getScheduledMails");
    }

    // 발송 후 scheduled 초기화
    public void markAsSent(int mailId) {
        mybatis.update("Mail.markAsSent", mailId);
    }

    public List<MailReceiverDTO> getMailReceivers(int mailId) {
        return mybatis.selectList("Mail.getMailReceivers", mailId);
    }
}