package com.kedu.ggirick_client_backend.dto.approval;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalFilesDTO {
    private int id;
    private String name;
    private String url;
    private int approvalId;
}
