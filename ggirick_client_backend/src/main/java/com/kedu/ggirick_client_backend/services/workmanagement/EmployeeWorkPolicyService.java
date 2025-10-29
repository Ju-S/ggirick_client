package com.kedu.ggirick_client_backend.services.workmanagement;

import com.kedu.ggirick_client_backend.dao.workmanagement.EmployeeWorkPolicyDAO;
import com.kedu.ggirick_client_backend.dto.workmanagement.EmployeeWorkPolicyDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeWorkPolicyService {
    private  final EmployeeWorkPolicyDAO employeeWorkPolicyDAO;

    // 모든 직원의 근무정책과 정책 상세정보 조회 - employee_work_policy + work_policy JOIN
    public List<EmployeeWorkPolicyDTO> getAllWithPolicyDetails() {
        return employeeWorkPolicyDAO.getAllWithPolicyDetails();
    }

    // 재직중인 직원의 근무정책 상세정보
    public List<EmployeeWorkPolicyDTO> getAllActiveWithPolicyDetails() {
        return employeeWorkPolicyDAO.getAllActiveWithPolicyDetails();
    }

    // 직원 한명 근무정책 상세정보
    public EmployeeWorkPolicyDTO getEmployeeWorkPolicyDetails(String employeeId) {
        return employeeWorkPolicyDAO.getEmployeeWorkPolicyDetails(employeeId);
    }
}
