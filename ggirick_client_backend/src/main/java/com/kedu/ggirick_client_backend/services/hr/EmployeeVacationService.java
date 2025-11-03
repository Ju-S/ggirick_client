package com.kedu.ggirick_client_backend.services.hr;

import com.kedu.ggirick_client_backend.dao.hr.EmployeeVacationDAO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployeeVacationService {
    private final EmployeeVacationDAO employeeVacationDAO;

    // 직원별 잔여 휴가 재계산 후 업데이트
    public int updateRemaining(String employeeId) {
        return employeeVacationDAO.updateRemaining(employeeId);
    }

    // 특정 직원 잔여일 조회
    public int getRemaining(String employeeId) {
        return employeeVacationDAO.getRemaining(employeeId);
    }
}
