package com.kedu.ggirick_client_backend.services.hr;

import com.kedu.ggirick_client_backend.dao.hr.EmploymentStatusDAO;
import com.kedu.ggirick_client_backend.dto.hr.EmploymentStatusDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmploymentStatusService {
    private final EmploymentStatusDAO employmentStatusDAO;

    // 직원 한명 입사일 조회
    public EmploymentStatusDTO getHireDateByEmployeeId(String EmployeeId) {
        return employmentStatusDAO.getHireDateByEmployeeId(EmployeeId);
    }
}
