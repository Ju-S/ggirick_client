package com.kedu.ggirick_client_backend.scheduler.workmanagement;

import com.kedu.ggirick_client_backend.services.workmanagement.WorkSummaryDailyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.text.SimpleDateFormat;
import java.util.Calendar;

@Slf4j
@Component
@RequiredArgsConstructor
public class WorkSummaryScheduler {

    private final WorkSummaryDailyService workSummaryDailyService;

    // 매일 오전 2시 30분 실행 (운영용)
    // cron = "초 분 시 일 월 요일"
    @Scheduled(cron = "0 30 2 * * *", zone = "Asia/Seoul")
    public void generateDailySummary() {
        // 날짜 계산 (00시 고정)
        Calendar cal = Calendar.getInstance(); // 현재 날짜·시간으로 객체 생성
        // 시, 분, 초, 밀리초 0으로 초기화
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);

        cal.add(Calendar.DAY_OF_MONTH, -1); // 하루 전으로 이동
        Date targetDate = new Date(cal.getTimeInMillis());

        String yyyyMMdd = new SimpleDateFormat("yyyy-MM-dd").format(targetDate);

        // 어제 근무기록 요약
        try {
            log.info("[WorkSummaryScheduler] {} 기준 근무요약 데이터 생성 시작", yyyyMMdd);
            workSummaryDailyService.dailyWorkSummary(targetDate);
            log.info("[WorkSummaryScheduler] {} 근무요약 데이터 생성 완료 ✅", yyyyMMdd);
        } catch (Exception e) {
            log.error("[WorkSummaryScheduler] {} 처리 중 예외 발생 ❌: {}", yyyyMMdd, e.getMessage(), e);
        }
    }
}
