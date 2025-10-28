package com.kedu.ggirick_client_backend.dto.approval;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalDocTypeDTO {
    private String code;
    private String name;
    private String description;
}
