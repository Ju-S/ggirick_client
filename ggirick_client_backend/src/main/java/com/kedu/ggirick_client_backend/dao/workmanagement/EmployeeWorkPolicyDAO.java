package com.kedu.ggirick_client_backend.dao.workmanagement;

import com.kedu.ggirick_client_backend.dto.workmanagement.EmployeeWorkPolicyDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class EmployeeWorkPolicyDAO {

    private final SqlSessionTemplate mybatis;

    // 모든 직원의 근무정책과 정책 상세정보 조회 - employee_work_policy + work_policy JOIN
    public List<EmployeeWorkPolicyDTO> getAllWithPolicyDetails() {
        return mybatis.selectList("EmployeeWorkPolicy.getAllWithPolicyDetails");
    }

    // 재직중인 직원의 근무정책 상세정보
    public List<EmployeeWorkPolicyDTO> getAllActiveWithPolicyDetails() {
        return mybatis.selectList("EmployeeWorkPolicy.getAllActiveWithPolicyDetails");
    }

    // 직원 한명의 근무정책 상세정보
    public EmployeeWorkPolicyDTO getEmployeeWorkPolicyDetails(String employeeId) {
        return mybatis.selectOne("EmployeeWorkPolicy.getEmployeeWorkPolicyDetails", employeeId);
    }
}
