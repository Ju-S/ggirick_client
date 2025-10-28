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

    /** 고유 ID (PK, vacation_log_seq) */
    private Long id;

    /** 직원 ID */
    private String employeeId;

    /** 결재(approval) ID */
    private Long approvalId;

    /** 휴가 시작일 */
    private Date startDate;

    /** 휴가 종료일 */
    private Date endDate;

    /** 사용일수 */
    private Integer daysUsed;

    /** 휴가 종류 (연차, 반차, 병가, 외출 등) */
    private String vacationType;

    /** 등록일시 */
    private Date createdAt;

    /** 수정일시 */
    private Date updatedAt;
}
