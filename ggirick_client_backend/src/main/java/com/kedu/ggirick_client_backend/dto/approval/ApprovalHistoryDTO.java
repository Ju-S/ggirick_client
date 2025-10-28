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
    private String name;
    private String contents;
    private int typeId;
    private Timestamp recordedAt;
    private String isDelegated;
}
