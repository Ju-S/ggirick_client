package com.kedu.ggirick_client_backend.scheduler.workmanagement;

import com.kedu.ggirick_client_backend.dto.workmanagement.EmployeeWorkPolicyDTO;
import com.kedu.ggirick_client_backend.services.workmanagement.EmployeeWorkPolicyService;
import com.kedu.ggirick_client_backend.services.workmanagement.WorkPlanService;
import com.kedu.ggirick_client_backend.utils.workmanagement.HalfYearUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class WorkPlanScheduler {

    private final WorkPlanService workPlanService;
    private final EmployeeWorkPolicyService employeeWorkPolicyService;

    // 상/하반기 시작일마다 자동 실행 (1월1일, 7월1일 새벽3시)
    @Scheduled(cron = "0 0 3 1 1,7 *", zone = "Asia/Seoul")
    public void autoGeneratePlans() {
        log.info("📅 상/하반기 근무계획 자동생성 시작");

        List<EmployeeWorkPolicyDTO> employeeList = employeeWorkPolicyService.getAllActiveWithPolicyDetails();

        Date today = Date.valueOf(LocalDate.now());
        Date startDate = HalfYearUtil.getHalfStart(today);
        Date endDate = HalfYearUtil.getHalfEnd(today);

        String empId = null;
        for (EmployeeWorkPolicyDTO dto : employeeList) {
            try {
                empId = dto.getEmployeeId();
                workPlanService.generateHalfYearPlans(dto, startDate, endDate);
                log.info("✅ {} 근무계획 생성 완료", empId);
            } catch (Exception e) {
                log.error("❌ {} 근무계획 생성 실패: {}", empId, e.getMessage());
            }
        }
        log.info("📅 상/하반기 근무계획 자동생성 완료");
    }
}
