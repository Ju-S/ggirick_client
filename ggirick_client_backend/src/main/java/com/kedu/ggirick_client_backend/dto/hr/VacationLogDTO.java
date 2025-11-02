package com.kedu.ggirick_client_backend.dto.hr;

import lombok.Data;

import java.util.Date;

/**
 * 📘 VacationLogDTO
 * 휴가 사용 기록 로그 (UI/전자결재 연동용)
 * - vacation_log 테이블과 매핑
 * - 전자결재 승인/취소와 연결됨
 */
@Data
public class VacationLogDTO {
    private int id; // 고유 ID (PK, vacation_log_seq)
    private String employeeId; // 직원 ID
    private int approvalId; // 결재(approval)
}
