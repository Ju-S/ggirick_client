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
    // @Scheduled(cron = "0 30 2 * * *", zone = "Asia/Seoul")

    // 테스트용: 1분마다 실행
    @Scheduled(fixedRate = 60 * 1000)
    public void generateDailySummary() {
        // 전일 기준 Date 계산
        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.DAY_OF_MONTH, -1);
        Date targetDate = new Date(cal.getTimeInMillis());

        // 로그용 포맷
        String yyyyMMdd = new SimpleDateFormat("yyyy-MM-dd").format(targetDate);

        log.info("[WorkSummaryScheduler] {} 기준 근무요약 데이터 생성 시작", yyyyMMdd);

        // 서비스 호출 (서비스도 Date 시그니처)
        workSummaryDailyService.aggregateDailyWorkSummary(targetDate);

        log.info("[WorkSummaryScheduler] {} 근무요약 데이터 생성 완료", yyyyMMdd);
    }
}
