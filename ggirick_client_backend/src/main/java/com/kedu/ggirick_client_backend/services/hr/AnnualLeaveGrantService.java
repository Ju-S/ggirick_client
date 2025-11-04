package com.kedu.ggirick_client_backend.services.hr;

import com.kedu.ggirick_client_backend.dao.hr.AnnualLeaveGrantDAO;
import com.kedu.ggirick_client_backend.dto.hr.AnnualLeaveGrantDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnnualLeaveGrantService {
    private final AnnualLeaveGrantDAO annualLeaveGrantDAO;

    // 연차 부여 등록
    public int insertAnnualLeaveGrant(AnnualLeaveGrantDTO dto) {
        return annualLeaveGrantDAO.insertAnnualLeaveGrant(dto);
    }

    // annual_leave_grant 사용일수 업데이트
    public int updateAnnualLeaveGrantUsage(Map<String, Object> params) {
        return annualLeaveGrantDAO.updateAnnualLeaveGrantUsage(params);
    }
    // 가장 최근에 부여한 연차 부여 이력 조회
    public AnnualLeaveGrantDTO getLatestGrantByEmployee(String employeeId) {
        return annualLeaveGrantDAO.getLatestGrantByEmployee(employeeId);
    }

    // 남은 연차 일수 조회
    public double getRemainingVacation(String employeeId) {
        return annualLeaveGrantDAO.getRemainingVacation(employeeId);
    }

    // 직원별 연차 목록 조회
    public List<AnnualLeaveGrantDTO> getAnnualLeaveListByEmployeeId(String employeeId) {
        return annualLeaveGrantDAO.getAnnualLeaveListByEmployeeId(employeeId);
    }
}
