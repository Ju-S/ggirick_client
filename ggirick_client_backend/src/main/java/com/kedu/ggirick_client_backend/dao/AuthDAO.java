package com.kedu.ggirick_client_backend.dao;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class AuthDAO {
    private final SqlSessionTemplate mybatis;

    public UserTokenDTO getTokenInfo(String id) {
        return mybatis.selectOne("Token.getTokenInfo", id);
    }
}
