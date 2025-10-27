package com.kedu.ggirick_client_backend.dto.approval;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalDelegateDTO {
    private int id;
    private String assigner;
    private String delegater;
    private Timestamp start_at;
    private Timestamp end_at;
}
