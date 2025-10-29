package com.kedu.ggirick_client_backend.services.workmanagement;

import com.kedu.ggirick_client_backend.dao.workmanagement.WorkPlanDAO;
import com.kedu.ggirick_client_backend.dto.workmanagement.EmployeeWorkPolicyDTO;
import com.kedu.ggirick_client_backend.dto.workmanagement.WorkPlanDTO;
import com.kedu.ggirick_client_backend.services.hr.EmploymentStatusService;
import com.kedu.ggirick_client_backend.utils.workmanagement.HalfYearUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WorkPlanService {

    private final WorkPlanDAO workPlanDAO;
    private final EmploymentStatusService employeeService;
    private final EmployeeWorkPolicyService employeeWorkPolicyService;

    // 입사 시 자동 근무계획 생성
    @Transactional
    public void generateInitialPlans(String employeeId) {
        // 입사일 조회
        Timestamp hireDate = employeeService.getHireDateByEmployeeId(employeeId).getRegDate();

        // Timestamp -> Date 타입 변환 ( 시간 버리기 )
        Date start = new Date(hireDate.getTime());
        Date end = HalfYearUtil.getHalfEnd(start);

        // Date -> LocalDate 변환 ( 날짜 계산 편의 )
        LocalDate s = start.toLocalDate();
        LocalDate e = end.toLocalDate();

        // 시작일 ~ 종료일까지 하루씩 증가하면서
        for (LocalDate day = s; !day.isAfter(e); day = day.plusDays(1)) {
            if (day.getDayOfWeek().getValue() >= 6) continue; // 주말 제외

            Date planDate = Date.valueOf(day);

            if (!workPlanDAO.exists(employeeId, planDate)) { // 해당 직원의 계획이 없다면
                // 해당 직원의 근무 정책 상세 조회
                EmployeeWorkPolicyDTO ewpDTO = employeeWorkPolicyService.getEmployeeWorkPolicyDetails(employeeId);

                // 계획 입력
                WorkPlanDTO dto = new WorkPlanDTO();
                dto.setEmployeeId(employeeId);
                dto.setPlanDate(planDate);
                dto.setStartDateTime(ewpDTO.getWorkStartTime());
                dto.setEndDateTime(ewpDTO.getWorkEndTime());
                dto.setType(ewpDTO.getPolicyName());
                dto.setStatus("POLICY"); // 기본 세팅 POLICY - 정책 기반 계획 등록이므로
                workPlanDAO.insertPlan(dto);
            }
        }
    }

    // 상/하반기 자동 생성
    @Transactional
    public void generateHalfYearPlans(EmployeeWorkPolicyDTO dto, Date startDate, Date endDate) {

        LocalDate s = startDate.toLocalDate();
        LocalDate e = endDate.toLocalDate();

        for (LocalDate day = s; !day.isAfter(e); day = day.plusDays(1)) {
            if (day.getDayOfWeek().getValue() >= 6) continue; // 주말 제외

            Date planDate = Date.valueOf(day);

            if (!workPlanDAO.exists(dto.getEmployeeId(), planDate)) {
                // 해당 직원의 근무 정책 상세 조회
                EmployeeWorkPolicyDTO ewpDTO = employeeWorkPolicyService.getEmployeeWorkPolicyDetails(dto.getEmployeeId());

                // 계획 입력
                WorkPlanDTO workplanDTO = new WorkPlanDTO();
                workplanDTO.setEmployeeId(dto.getEmployeeId());
                workplanDTO.setPlanDate(planDate);
                workplanDTO.setStartDateTime(ewpDTO.getWorkStartTime());
                workplanDTO.setEndDateTime(ewpDTO.getWorkEndTime());
                workplanDTO.setType(ewpDTO.getPolicyName());
                workplanDTO.setStatus("POLICY");
                workPlanDAO.insertPlan(workplanDTO);
            }
        }
    }

    // 일/주/월간 통합 조회
    public List<WorkPlanDTO> getPlansByPeriod(String employeeId, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> params = new HashMap<>();
        params.put("employeeId", employeeId);
        params.put("startDate", startDate);
        params.put("endDate", endDate);
        return workPlanDAO.getPlansByPeriod(params);
    }
}
