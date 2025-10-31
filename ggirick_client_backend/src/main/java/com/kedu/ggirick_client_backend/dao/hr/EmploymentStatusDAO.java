package com.kedu.ggirick_client_backend.dao.hr;

import com.kedu.ggirick_client_backend.dto.hr.EmploymentStatusDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class EmploymentStatusDAO {
    private SqlSessionTemplate mybatis;

    // 직원 한명 입사일 조회
    public EmploymentStatusDTO getHireDateByEmployeeId(String EmployeeId) {
        return mybatis.selectOne("EmploymentStatus.getHireDateByEmployeeId", EmployeeId);
    }
}


