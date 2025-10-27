package com.kedu.ggirick_client_backend.dao.hr;

import com.kedu.ggirick_client_backend.dto.hr.AuthorityDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class AuthorityDAO {
    private final SqlSessionTemplate mybatis;

    // 권한 목록 조회 ( 메타 데이터 조회용 )
    public List<AuthorityDTO> getAllAuthorities() {
        return mybatis.selectList("HrMetadata.getAllAuthorities");
    }
}
