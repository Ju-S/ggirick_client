package com.kedu.ggirick_client_backend.dto.workmanagement;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data // Getter & Setter & ToString & RequiredArgsConstructor
@NoArgsConstructor
@AllArgsConstructor
public class WorkSearchConditionDTO {
    private String employeeId;     // 개인 조회용
    private String departmentId;   // 부서 조회용
    private String organizationId; // 조직 조회용

    private LocalDate startDate;    // 기간 시작
    private LocalDate endDate;      // 기간 끝

    private String type;         // "plan" or "record" 구분용
}
