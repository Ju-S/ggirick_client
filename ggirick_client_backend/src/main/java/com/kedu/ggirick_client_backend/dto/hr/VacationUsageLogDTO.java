package com.kedu.ggirick_client_backend.dto.hr;

import lombok.Data;

import java.sql.Timestamp;
import java.util.Date;

@Data
public class VacationUsageLogDTO {

    private int usageId; // 휴가 사용 고유 ID (PK)
    private String employeeId; // 직원 ID
    private int approvalId; // 전자결재 approval 테이블 ID (휴가 신청서 참조)
    private int grantId; // 연차 부여 ID (annual_leave_grant.grant_id 참조)
    private Timestamp startDate; // 휴가 시작일 (시간 포함)
    private Timestamp endDate; // 휴가 종료일 (시간 포함)
    private double daysUsed; // 사용한 휴가 일수
    private String vacationType; // 휴가 종류 (연차, 반차, 외출 등)
    private Date usedDate; // 실제 사용 등록일 (결재 승인일 등)
    private Date createdAt; // 생성일시
    private Date updatedAt; // 수정일시
}
