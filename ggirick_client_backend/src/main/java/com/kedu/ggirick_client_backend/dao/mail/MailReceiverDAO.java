package com.kedu.ggirick_client_backend.dao.mail;

import com.kedu.ggirick_client_backend.dto.mail.MailDTO;
import com.kedu.ggirick_client_backend.dto.mail.MailReceiverDTO;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class MailReceiverDAO {
    private final SqlSession mybatis;

    public int addMailReceiver(MailReceiverDTO mailReceiverDTO) {
        return mybatis.insert("Mail.addMailReceiver", mailReceiverDTO);
    }

    public String findEmployeeIdByEmail(String email) {
        return mybatis.selectOne("Mail.findEmployeeIdByEmail", email);
    }


}
