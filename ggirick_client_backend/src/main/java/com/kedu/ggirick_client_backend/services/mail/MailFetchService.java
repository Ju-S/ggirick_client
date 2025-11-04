package com.kedu.ggirick_client_backend.services.mail;

import com.kedu.ggirick_client_backend.dao.mail.MailDAO;
import com.kedu.ggirick_client_backend.dto.mail.MailDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MailFetchService {
    private final MailDAO mailDAO;

    public List<MailDTO> fetchUserMails(String folder, String email) {
        if (folder == null || folder.isBlank() || "all".equals(folder)) {
            return mailDAO.getAllMailsByEmployee(email);
        }
        switch (folder) {
            case "inbox": return mailDAO.getInboxMails(email);
            case "sent": return mailDAO.getSentMails(email);
            case "important": return mailDAO.getImportantMails(email);
            case "spam": return mailDAO.getSpamMails(email);
            case "trash": return mailDAO.getTrashMails(email);
            default: return mailDAO.getAllMailsByEmployee(email);
        }
    }

    public MailDTO fetchMailDetail(int id) {
        return mailDAO.getMailById(id);
    }
}