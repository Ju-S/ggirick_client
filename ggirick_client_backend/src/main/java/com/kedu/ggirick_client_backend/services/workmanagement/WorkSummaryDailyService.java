package com.kedu.ggirick_client_backend.services.workmanagement;

import com.kedu.ggirick_client_backend.dao.workmanagement.WorkSummaryDailyDAO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkSummaryDailyService {

    private final WorkSummaryDailyDAO workSummaryDailyDAO;

    //  전일 근무기록을 요약하여 WORK_SUMMARY_DAILY에 MERGE
    public void aggregateDailyWorkSummary(LocalDate targetDate) {
        // 시스템 로그 찍기
        log.info("[WorkSummaryDailyService] 근무기록 요약 중... {}", targetDate);
        int count = workSummaryDailyDAO.aggregateDailyWorkSummary(targetDate);
        log.info("[WorkSummaryDailyService] {} 요약된 데이터 수: {}", targetDate, count);
    }
}
