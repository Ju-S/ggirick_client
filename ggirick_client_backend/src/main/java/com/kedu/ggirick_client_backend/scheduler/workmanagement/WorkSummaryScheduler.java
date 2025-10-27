package com.kedu.ggirick_client_backend.scheduler.workmanagement;

import com.kedu.ggirick_client_backend.services.workmanagement.WorkSummaryDailyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

// 매일 오전 2시 30분에 전일 근무기록을 요약하여 WORK_SUMMARY_DAILY에 반영
@Slf4j
@Component
@RequiredArgsConstructor
public class WorkSummaryScheduler {

    private final WorkSummaryDailyService workSummaryDailyService;

    // 매일 오전 2시 30분 실행
    // cron = "초 분 시 일 월 요일"
    //@Scheduled(cron = "0 30 2 * * *", zone = "Asia/Seoul")
    @Scheduled(fixedRate = 10 * 60 * 1000) // 테스트용 10분마다 실행 (밀리초 단위)
    public void generateDailySummary() {
        LocalDate targetDate = LocalDate.now().minusDays(1); // 전일 기준
        // 시스템 로그 남기기
        log.info("[WorkSummaryScheduler] {} 기준 근무요약 데이터 생성 시작",
                targetDate.format(DateTimeFormatter.ISO_DATE));

        workSummaryDailyService.aggregateDailyWorkSummary(targetDate);

        log.info("WorkSummaryScheduler] {} 근무요약 데이터 생성 완료",
                targetDate.format(DateTimeFormatter.ISO_DATE));
    }
}

