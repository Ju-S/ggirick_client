package com.kedu.ggirick_client_backend.dao.mail;

import com.kedu.ggirick_client_backend.dto.mail.MailDTO;
import com.kedu.ggirick_client_backend.dto.mail.MailSendDTO;
import com.kedu.ggirick_client_backend.dto.mail.MailReceiverDTO;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class MailDAO {

    private final SqlSession mybatis;

    public Integer existsByUid(String mailUid) {
        return mybatis.selectOne("Mail.existsByUid", mailUid);
    }

    public boolean existsByUidBool(String mailUid) {
        Integer r = existsByUid(mailUid);
        return r != null && r == 1;
    }

    public int addMail(MailDTO mailDTO) {
        return mybatis.insert("Mail.addMail", mailDTO);
    }

    public int sendMail(MailSendDTO mailSendDTO) {
        return mybatis.insert("Mail.sendMail", mailSendDTO);
    }

    public int insertReceivers(MailSendDTO mailSendDTO) {
        int count = 0;
        if (mailSendDTO.getToList() != null) {
            for (String to : mailSendDTO.getToList()) {
                MailReceiverDTO dto = MailReceiverDTO.builder()
                        .mailId(mailSendDTO.getId())
                        .receiver(to)
                        .typeId(1)
                        .statusId(1) // 받은메일(초기 상태 INBOX or unread? 네 선택은 상태로만 관리 - 여기 1=INBOX)
                        .build();
                count += mybatis.insert("Mail.insertReceiver", dto);
            }
        }
        if (mailSendDTO.getCcList() != null) {
            for (String cc : mailSendDTO.getCcList()) {
                MailReceiverDTO dto = MailReceiverDTO.builder()
                        .mailId(mailSendDTO.getId())
                        .receiver(cc)
                        .typeId(2)
                        .statusId(1)
                        .build();
                count += mybatis.insert("Mail.insertReceiver", dto);
            }
        }
        if (mailSendDTO.getBccList() != null) {
            for (String bcc : mailSendDTO.getBccList()) {
                MailReceiverDTO dto = MailReceiverDTO.builder()
                        .mailId(mailSendDTO.getId())
                        .receiver(bcc)
                        .typeId(3)
                        .statusId(1)
                        .build();
                count += mybatis.insert("Mail.insertReceiver", dto);
            }
        }
        return count;
    }

    public int sendAttachments(MailSendDTO mailSendDTO) {
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

    public List<MailSendDTO> getScheduledMails() {
        return mybatis.selectList("Mail.getScheduledMails");
    }

    public List<com.kedu.ggirick_client_backend.dto.mail.MailReceiverDTO> getMailReceivers(int mailId) {
        return mybatis.selectList("Mail.getMailReceivers", mailId);
    }

    public void markAsSent(int mailId) {
        mybatis.update("Mail.markAsSent", mailId);
    }

    public int updateSentAt(int mailId, LocalDateTime sentAt) {
        Map<String, Object> param = new HashMap<>();
        param.put("mailId", mailId);
        param.put("sentAt", sentAt);
        return mybatis.update("Mail.updateSentAt", param);
    }

    // fetch methods used by MailFetchService
    public List<MailDTO> getAllMailsByEmployee(String email) {
        return mybatis.selectList("Mail.selectAllMailsByEmployee", email);
    }

    public List<MailDTO> getInboxMails(String email) {
        return mybatis.selectList("Mail.selectInboxMails", email);
    }

    public List<MailDTO> getSentMails(String email) {
        return mybatis.selectList("Mail.selectSentMails", email);
    }

    public List<MailDTO> getImportantMails(String email) {
        return mybatis.selectList("Mail.selectImportantMails", email);
    }

    public List<MailDTO> getSpamMails(String email) {
        return mybatis.selectList("Mail.selectSpamMails", email);
    }

    public List<MailDTO> getTrashMails(String email) {
        return mybatis.selectList("Mail.selectTrashMails", email);
    }

    public MailDTO getMailById(int id) {
        return mybatis.selectOne("Mail.selectMailById", id);
    }

    public int updateReceiverStatus(Map<String, Object> param) {
        return mybatis.update("Mail.updateReceiverStatus", param);
    }

    public int deleteMailReceiver(int receiverId) {
        return mybatis.delete("Mail.deleteMailReceiver", receiverId);
    }

//    public List<Map<String,Object>> getMailFiles(int mailId) {
//        return mybatis.selectList("Mail.getMailFiles", mailId);
//    }
//
//    public int deleteMailFilesByMailId(int mailId) {
//        return mybatis.delete("Mail.deleteMailFilesByMailId", mailId);
//    }
}