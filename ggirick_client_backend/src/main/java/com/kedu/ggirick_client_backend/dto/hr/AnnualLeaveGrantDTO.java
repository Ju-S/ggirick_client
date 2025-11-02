package com.kedu.ggirick_client_backend.dto.hr;

import lombok.Data;

import java.util.Date;

@Data
public class AnnualLeaveGrantDTO {
    private int grantId; // 연차 부여 고유 ID (PK)
    private String employeeId; // 직원 ID (employee.id 참조)
    private Date grantDate; // 연차 발생일 (보통 입사기준 또는 매년 1월 1일)
    private Date expireDate; // 연차 만료일 (보통 1년 뒤)
    private Integer daysGranted; // 부여된 총 연차 일수
    private Integer daysUsed; // 현재까지 사용한 연차 일수
    private String reason; // 부여 사유 (입사, 정기갱신 등)
    private Date createdAt; // 생성일시
    private Date updatedAt; // 수정일시
}
