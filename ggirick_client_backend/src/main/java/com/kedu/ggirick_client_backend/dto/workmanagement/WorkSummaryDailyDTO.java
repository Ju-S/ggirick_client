package com.kedu.ggirick_client_backend.dto.workmanagement;

import lombok.*;
import java.sql.Date;
import java.sql.Timestamp;

/**
 * WorkSummaryDailyDTO
 * - 일별 근무 요약 (WORK_SUMMARY_DAILY 테이블)
 * - 하루 단위로 근무기록 요약한 결과 저장
 * - 통계 조회(일간/주간/월간/연간) 시 핵심 데이터
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class WorkSummaryDailyDTO {

    private String employeeId;        // 직원 ID
    private Date workDate;            // 근무 일자 (YYYY-MM-DD, 하루 단위)
    private Timestamp startTime;      // 출근 시각
    private Timestamp endTime;        // 퇴근 시각
    private Double totalHours;        // 총 근무시간
    private Double workHours;         // 실제 근무시간 (휴식 제외)
    private Double overtimeHours;     // 연장근무시간
    private Double nightHours;        // 야간근무시간
    private Double leaveHours;        // 휴가시간
    private String status;            // 근태 상태 (NORMAL / LATE / EARLY_LEAVE / ABSENT)

    private Integer policyId;         // 적용된 근무정책 ID
    private String departmentId;      // 부서 ID
    private String organizationId;    // 조직 ID
    private Timestamp createdAt;      // 생성시각
    private Timestamp updatedAt;      // 수정시각
    private String note;              // 비고 (예외 사유)
}
