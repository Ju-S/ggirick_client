package com.kedu.ggirick_client_backend.controllers.workmanagement;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.workmanagement.WorkSummaryDTO;
import com.kedu.ggirick_client_backend.services.workmanagement.WorkSummaryDailyService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequiredArgsConstructor
@RequestMapping("/worksummarydaily")
public class WorkSummaryDailyController {
    private final WorkSummaryDailyService workSummaryDailyService;

    // 통합 근무요약 API (일간 / 주간 / 연간 / 직접 기간)
    @GetMapping("/summary")
    public ResponseEntity<WorkSummaryDTO> getWorkSummary(
            @RequestParam(defaultValue = "daily") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        WorkSummaryDTO summary = workSummaryDailyService.getWorkSummary(userInfo.getId(), period, startDate, endDate);
        return ResponseEntity.ok(summary);
    }
}
