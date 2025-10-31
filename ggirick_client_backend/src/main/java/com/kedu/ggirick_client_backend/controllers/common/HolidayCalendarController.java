package com.kedu.ggirick_client_backend.controllers.common;

import com.kedu.ggirick_client_backend.dto.common.HolidayCalendarDTO;
import com.kedu.ggirick_client_backend.services.common.HolidayCalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/holiday")
@RequiredArgsConstructor
public class HolidayCalendarController {

    private final HolidayCalendarService holidayCalendarService;

    // 지정 기간 내의 공휴일 목록 조회
    @GetMapping("/list")
    public ResponseEntity<List<HolidayCalendarDTO>> getHolidaysByPeriod(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(holidayCalendarService.getHolidaysByPeriod(startDate, endDate));
    }
}
