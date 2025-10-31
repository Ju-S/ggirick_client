package com.kedu.ggirick_client_backend.dto.hr;

import lombok.*;

import java.sql.Timestamp;

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

    // 조인해서 불러올 때 사용할 이름 필드
    private String departmentName;   // 부서명
    private String organizationName; // 조직명
    private String jobName;          // 직급명
    private Timestamp hireDate;          // 입사일
    private String status; // 재직상태
    private String statusName; // 재직상태

    // 직급이 바뀌었는지 판단용 flag (Service에서 세팅)
    private Boolean jobChanged;
}
