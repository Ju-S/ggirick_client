package com.kedu.ggirick_client_backend.utils.approval;

import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;

@Component
public class DocDataUtil {

    public Timestamp convertToTimestamp(Map<String, Object> docData, boolean isStart) {
        String date = (String) docData.get(isStart ? "startDate" : "endDate");
        String time = (String) docData.get(isStart ? "startTime" : "endTime");

        if (date == null || time == null) return null;

        // 문자열 합치기: "2025-10-28 09:00"
        String dateTimeStr = date + " " + time;

        // 포맷터
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        // LocalDateTime 생성
        LocalDateTime localDateTime = LocalDateTime.parse(dateTimeStr, formatter);

        // Timestamp 변환
        return Timestamp.valueOf(localDateTime);
    }
}