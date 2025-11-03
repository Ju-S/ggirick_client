package com.kedu.ggirick_client_backend.controllers.workmanagement;

import com.kedu.ggirick_client_backend.services.workmanagement.WorkSummaryDailyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.text.SimpleDateFormat;

@RestController
@RequestMapping("/api/work-summary")
@RequiredArgsConstructor
public class WorkSummaryTestController {

    private final WorkSummaryDailyService workSummaryDailyService;

    // 특정 날짜 수동 요약 (예: /api/work-summary/manual?date=2025-10-10)
    @PostMapping("/manual")
    public String manualAggregate(@RequestParam("date") String dateStr) throws Exception {
        java.util.Date parsed = new SimpleDateFormat("yyyy-MM-dd").parse(dateStr);
        Date sqlDate = new Date(parsed.getTime());

        workSummaryDailyService.dailyWorkSummary(sqlDate);

        return "✅ " + dateStr + " 근무 요약 생성 완료!";
    }

    @ExceptionHandler
    public ResponseEntity<Void> error(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
