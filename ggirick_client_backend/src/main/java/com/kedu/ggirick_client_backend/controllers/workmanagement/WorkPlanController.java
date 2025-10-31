package com.kedu.ggirick_client_backend.controllers.workmanagement;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.workmanagement.WorkPlanDTO;
import com.kedu.ggirick_client_backend.services.workmanagement.WorkPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

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

}
