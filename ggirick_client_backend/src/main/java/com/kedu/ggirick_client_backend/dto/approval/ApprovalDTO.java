package com.kedu.ggirick_client_backend.dto.approval;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalDTO {
    private int id;
    private String title;
    private String writer;
    private String content; // JSON형태로 양식에 따라 바뀔 내용
    private int type_id; // 결재서류 현 상태(승인, 반려, 대기, 의견)
    private Timestamp createdAt;
    private Timestamp updatedAt; // 결재서류 수정 시간(재승인 용도)
    private Timestamp assignedAt; // 결재서류 승인 시간
}
