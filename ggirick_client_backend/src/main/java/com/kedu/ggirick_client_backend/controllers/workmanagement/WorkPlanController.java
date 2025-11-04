package com.kedu.ggirick_client_backend.controllers.workmanagement;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.workmanagement.WorkPlanDTO;
import com.kedu.ggirick_client_backend.services.workmanagement.WorkPlanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/workmanagement/plan")
@RequiredArgsConstructor
public class WorkPlanController {
    private final WorkPlanService workPlanService;

    // 일/주/월별 계획 조회
    @GetMapping("/list")
    public ResponseEntity<List<WorkPlanDTO>> getPlans(
            @AuthenticationPrincipal UserTokenDTO userInfo,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(workPlanService.getPlansByPeriod(userInfo.getId(), startDate, endDate));
    }

    // 근무계획 수동 생성
    @PostMapping("/generate-initial/{employeeId}")
    public ResponseEntity<String> generateInitialPlans(@PathVariable String employeeId) {
        try {
            log.info("[WorkPlanController] {} 근무계획 수동 생성 요청", employeeId);
            workPlanService.generateInitialPlans(employeeId);
            log.info("[WorkPlanController] {} 근무계획 수동 생성 완료 ✅", employeeId);
            return ResponseEntity.ok("근무계획이 수동으로 생성되었습니다.");
        } catch (Exception e) {
            log.error("[WorkPlanController] 근무계획 생성 실패 ❌: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body("근무계획 생성 중 오류 발생: " + e.getMessage());
        }
    }
}
