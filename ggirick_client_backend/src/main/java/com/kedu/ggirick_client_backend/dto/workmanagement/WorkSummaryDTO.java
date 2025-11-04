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
    private double leaveHours;     // 휴가 합계

    private Integer plannedHours; // 하루 근무 계획 시간
    private Integer totalPlannedHours; // 계획 시간 합계

    private double remainingVacation;

    private String periodType; // "daily", "weekly", "annual"
}
