package com.kedu.ggirick_client_backend.dao.mail;

import com.kedu.ggirick_client_backend.dto.mail.MailDTO;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class MailDAO {
    private final SqlSession mybatis;

    public int addMail(MailDTO mailDTO){
        return mybatis.insert("Mail.addMail", mailDTO);
    }

    public boolean existsByUid(String uid){
        return mybatis.selectOne("Mail.existsByUid", uid) != null;
    }
}
