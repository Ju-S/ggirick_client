package com.kedu.ggirick_client_backend.dao.mail;

import com.kedu.ggirick_client_backend.dto.mail.MailDTO;
import com.kedu.ggirick_client_backend.dto.mail.MailReceiverDTO;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class MailReceiverDAO {
    private final SqlSession mybatis;

    public int addMailReceiver(MailReceiverDTO mailReceiverDTO) {
        return mybatis.insert("Mail.addMailReceiver", mailReceiverDTO);
    }
}
