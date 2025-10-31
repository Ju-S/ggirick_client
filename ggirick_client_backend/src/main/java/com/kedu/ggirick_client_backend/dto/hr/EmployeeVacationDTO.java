package com.kedu.ggirick_client_backend.dto.hr;

import lombok.Data;

import java.util.Date;

/**
 * 📘 EmployeeVacationDTO
 * 직원별 잔여 휴가 관리 테이블 DTO
 * - 연차 부여 및 사용 기록에 따라 잔여 휴가 갱신
 * - employee_vacation 테이블과 매핑
 */
@Data
public class EmployeeVacationDTO {

    /** 고유 ID (PK) */
    private Long id;

    /** 직원 ID (employee.id 참조) */
    private String employeeId;

    /** 잔여 휴가 일수 */
    private Integer remainingVacation;

    /** 마지막 갱신일시 */
    private Date updatedAt;
}
