package com.kedu.ggirick_client_backend.dao.hr;

import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

/**
 * 📘 EmployeeVacationDAO
 * 직원별 잔여 휴가 수 관리 DAO
 * - annual_leave_grant 테이블과 동기화
 */
@Repository
@RequiredArgsConstructor
public class EmployeeVacationDAO {

    private final SqlSessionTemplate mybatis;

    // 직원별 잔여 휴가 재계산 후 업데이트
    public int updateRemaining(String employeeId) {
        return mybatis.update("EmployeeVacation.updateRemaining", employeeId);
    }

    // 특정 직원 잔여일 조회
    public int getRemaining(String employeeId) {
        return mybatis.selectOne("EmployeeVacation.getRemaining", employeeId);
    }
}
