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
    private int orderLine;

    // 출력 시 필요한 이름 및 부서명
    private String name;
    private String departmentName;
}
