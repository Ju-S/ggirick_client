package com.kedu.ggirick_client_backend.dto.hr;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrgEmployeeDTO {
    private String id;
    private String name;
    private String email;
    private String jobName;      // 직급명
    private Integer rankOrder;   // 직급 순서
    private String profileUrl;
    private String deptCode;
    private String deptName;
    private String orgCode;
    private String orgName;
}