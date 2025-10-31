package com.kedu.ggirick_client_backend.services.workmanagement;

import com.kedu.ggirick_client_backend.dao.workmanagement.WorkPlanDAO;
import com.kedu.ggirick_client_backend.dto.workmanagement.EmployeeWorkPolicyDTO;
import com.kedu.ggirick_client_backend.dto.workmanagement.WorkPlanDTO;
import com.kedu.ggirick_client_backend.services.common.HolidayCalendarService;
import com.kedu.ggirick_client_backend.services.hr.EmploymentStatusService;
import com.kedu.ggirick_client_backend.utils.workmanagement.HalfYearUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WorkPlanService {

    private final WorkPlanDAO workPlanDAO;
    private final EmploymentStatusService employeeService;
    private final EmployeeWorkPolicyService employeeWorkPolicyService;
    private final HolidayCalendarService holidayCalendarService;

    // 입사 시 자동 근무계획 생성
    @Transactional
    public void generateInitialPlans(String employeeId) {
        // 입사일 조회
        Timestamp hireDate = employeeService.getHireDateByEmployeeId(employeeId).getRegDate();

        // Timestamp -> Date 타입 변환 (시간 제거)
        Date start = new Date(hireDate.getTime());
        Date end = HalfYearUtil.getHalfEnd(start);

        LocalDate s = start.toLocalDate();
        LocalDate e = end.toLocalDate();

        for (LocalDate day = s; !day.isAfter(e); day = day.plusDays(1)) {
            // 주말 또는 공휴일은 제외
            if (day.getDayOfWeek().getValue() >= 6) continue;
            if (holidayCalendarService.isHoliday(Date.valueOf(day))) continue;

            // 기준 날짜
            Date planDate = Date.valueOf(day);

            // 근무정책 시간 (LocalTime)
            EmployeeWorkPolicyDTO ewpDTO = employeeWorkPolicyService.getEmployeeWorkPolicyDetails(employeeId);
            LocalTime startTime = ewpDTO.getWorkStartTime();
            LocalTime endTime = ewpDTO.getWorkEndTime();

            // 날짜 + 시간 결합 → LocalDateTime
            LocalDateTime startDateTime = day.atTime(startTime);
            LocalDateTime endDateTime = day.atTime(endTime);

            if (!workPlanDAO.exists(employeeId, planDate)) {
                WorkPlanDTO dto = new WorkPlanDTO();
                dto.setEmployeeId(employeeId);
                dto.setPlanDate(planDate);
                dto.setStartDateTime(startDateTime);
                dto.setEndDateTime(endDateTime);
                dto.setType(ewpDTO.getPolicyName());
                dto.setStatus("POLICY");
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
            // 주말 또는 공휴일은 제외
            if (day.getDayOfWeek().getValue() >= 6) continue;
            if (holidayCalendarService.isHoliday(Date.valueOf(day))) continue;

            // 기준 날짜
            Date planDate = Date.valueOf(day);

            // employeeId
            String employeeId = dto.getEmployeeId();

            // 근무정책 시간 (LocalTime)
            LocalTime startTime = dto.getWorkStartTime();
            LocalTime endTime = dto.getWorkEndTime();

            // 날짜 + 시간 결합 → LocalDateTime
            LocalDateTime startDateTime = day.atTime(startTime);
            LocalDateTime endDateTime = day.atTime(endTime);

            if (!workPlanDAO.exists(employeeId, planDate)) {
                WorkPlanDTO workPlanDTO = new WorkPlanDTO();
                workPlanDTO.setEmployeeId(employeeId);
                workPlanDTO.setPlanDate(planDate);
                workPlanDTO.setStartDateTime(startDateTime);
                workPlanDTO.setEndDateTime(endDateTime);
                workPlanDTO.setType(dto.getPolicyName());
                workPlanDTO.setStatus("POLICY");
                workPlanDAO.insertPlan(workPlanDTO);
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
