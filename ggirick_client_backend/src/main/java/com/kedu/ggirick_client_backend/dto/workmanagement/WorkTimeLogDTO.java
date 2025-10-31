package com.kedu.ggirick_client_backend.dto.workmanagement;

import lombok.*;
import java.sql.Timestamp;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class WorkTimeLogDTO {

    private Long id;           // 고유 로그 식별자 (ID)
    private String employeeId;    // 직원 ID (EMPLOYEE_ID)
    private String type;          // 근무 유형 (IN, OUT, MEETING, OT, BREAK, LEAVE)
    private Timestamp recordedAt; // 근무 이벤트 발생 시각 (RECORDED_AT)
}
