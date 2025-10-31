package com.kedu.ggirick_client_backend.utils.workmanagement;

import java.sql.Date;

// 상/하반기 계산 유틸
public class HalfYearUtil {

    // 상/하반기 시작일 반환
    public static Date getHalfStart(Date date) {
        // "2025-03-15" 형태 → 연도 / 월 추출
        String dateStr = date.toString();
        int year = Integer.parseInt(dateStr.substring(0, 4));
        int month = Integer.parseInt(dateStr.substring(5, 7));

        // 6월 이전이면 1월 1일, 이후면 7월 1일
        String startDateStr = (month <= 6)
                ? year + "-01-01"
                : year + "-07-01";

        return Date.valueOf(startDateStr);
    }

    // 상/하반기 종료일 반환
    public static Date getHalfEnd(Date date) {
        String dateStr = date.toString();
        int year = Integer.parseInt(dateStr.substring(0, 4));
        int month = Integer.parseInt(dateStr.substring(5, 7));

        // 6월 이전이면 6월 30일, 이후면 12월 31일
        String endDateStr = (month <= 6)
                ? year + "-06-30"
                : year + "-12-31";

        return Date.valueOf(endDateStr);
    }
}