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

    // password_reset 테이블에서 삭제
    public int deletePasswordResetById(String id) {
        return mybatis.delete("Auth.deletePasswordResetById", id);
    }

    // 초기 비밀번호로 로그인했는지 체크
    public int existsInPasswordReset(String empId) {
        return mybatis.selectOne("Auth.existsInPasswordReset", empId);
    }
}
