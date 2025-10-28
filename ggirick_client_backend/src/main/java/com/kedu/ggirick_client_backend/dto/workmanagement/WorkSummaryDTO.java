package com.kedu.ggirick_client_backend.dto.workmanagement;

import lombok.Data;

@Data
public class WorkSummaryDTO {
    private int lateCount;
    private int earlyLeaveCount;
    private int missingOutCount;
    private int absentCount;

    private int workDays;
    private double totalHours;
    private double avgHours;
    private double overtimeHours;  // 연장근무시간 합계
    private double nightHours;     // 야간근무시간 합계

    private int remainingVacation;

    private String periodType; // "daily", "weekly", "annual"
}
