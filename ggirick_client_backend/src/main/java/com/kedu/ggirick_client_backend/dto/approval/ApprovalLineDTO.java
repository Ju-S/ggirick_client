package com.kedu.ggirick_client_backend.dto.approval;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalLineDTO {
    private int id;
    private int approvalId;
    private String assigner;
    private String nextAssigner;
}
