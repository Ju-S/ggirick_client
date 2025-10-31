package com.kedu.ggirick_client_backend.dto.hr;

import lombok.Data;

import java.util.Date;

// 휴가 사용 촉진 알림 기록
// 근로기준법 제60조 7항에 따라 6개월 전 / 2개월 전 미사용자에게 알림 발송
@Data
public class VacationNotificationLogDTO {

    private Long id; // 알림 고유 ID (PK)
    private String employeeId; // 직원 ID
    private Long grantId; // 해당 연차 부여 ID
    private String noticeType; // 알림 종류 (6MONTH, 2MONTH 등)
    private Date sentDate; // 실제 알림 발송일
    private String message; // 알림 내용 (메시지)
    private Date createdAt; // 생성일시
}
