package com.kedu.ggirick_client_backend.dto.approval;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalHistoryDTO {
    private int id;
    private int approvalId;
    private String assigner;
    private int typeId;
    private Timestamp recordedAt;

    // 결재서류 상세보기에서 기록을 출력하기 위한 상태이름.
    // approval_type테이블에서 가져오기
    private String typeName;
}
