package com.kedu.ggirick_client_backend.dto.hr;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeDTO {
    private String id;
    private String pw;
    private String name;
    private String phone;
    private String extension;
    private String email;
    private String profileUrl;

    // 아래 3개는 테이블 FK용 임시 필드 - 등록시에 사용
    private String departmentCode;  // 부서코드
    private String organizationCode;   // 조직코드
    private String jobCode;   // 직급코드
}
