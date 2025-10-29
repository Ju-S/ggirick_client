package com.kedu.ggirick_client_backend.dto.workmanagement;

import lombok.*;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 🗓️ WorkPlanDTO
 * - 근무 및 휴가 계획 관리 (WORK_PLAN 테이블)
 * - 캘린더(FullCalendar) 연동용 DTO
 * - 근무유형: NORMAL, LEAVE, OUTSIDE, MEETING 등
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class WorkPlanDTO {

    private Long planId;                 // 계획 ID (PLAN_ID)
    private String employeeId;           // 직원 ID (EMPLOYEE_ID)
    private Date planDate;                // 계획일
    private LocalDateTime startDateTime; // 근무 시작 예정 시각
    private LocalDateTime endDateTime;   // 근무 종료 예정 시각
    private String type;                 // 계획 유형 (NORMAL / LEAVE / OUTSIDE / MEETING)
    private String status;               // 승인 상태 (APPROVED / WAIT / REJECTED)
    private LocalDate createdAt; // 생성일
    private LocalDate updatedAt; // 최근 수정일
}
