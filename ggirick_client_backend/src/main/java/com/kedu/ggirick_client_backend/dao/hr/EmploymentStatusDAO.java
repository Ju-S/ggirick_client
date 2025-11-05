package com.kedu.ggirick_client_backend.dao.hr;

import com.kedu.ggirick_client_backend.dto.hr.EmploymentStatusDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class EmploymentStatusDAO {
    private final SqlSessionTemplate mybatis;

    // 직원 한명 입사일 조회
    public EmploymentStatusDTO getHireDateByEmployeeId(String employeeId) {
        return mybatis.selectOne("EmploymentStatus.getHireDateByEmployeeId", employeeId);
    }
}


