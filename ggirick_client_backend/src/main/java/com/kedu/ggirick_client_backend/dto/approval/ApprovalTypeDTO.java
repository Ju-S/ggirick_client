package com.kedu.ggirick_client_backend.dto.approval;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalTypeDTO {
    private int id;
    private String name;
    private String description;
}
