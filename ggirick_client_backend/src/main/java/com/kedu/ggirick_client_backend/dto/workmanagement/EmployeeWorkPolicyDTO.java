package com.kedu.ggirick_client_backend.dto.workmanagement;

import lombok.*;

import java.time.LocalTime;

/**
 * EmployeeWorkPolicyDTO
 * - 직원별 근무정책 정보
 * - employee_work_policy + work_policy JOIN 결과
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EmployeeWorkPolicyDTO {

    private String employeeId;     // 직원 ID
    private Integer policyId;      // 정책 ID
    private String policyName;     // 정책 이름 (예: NORMAL, FLEXIBLE)
    private LocalTime workStartTime;   // 근무 시작시간
    private LocalTime workEndTime;     // 근무 종료시간
}
