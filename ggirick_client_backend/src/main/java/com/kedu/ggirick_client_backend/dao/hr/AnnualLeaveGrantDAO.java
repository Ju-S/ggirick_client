package com.kedu.ggirick_client_backend.dao.hr;

import com.kedu.ggirick_client_backend.dto.hr.AnnualLeaveGrantDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class AnnualLeaveGrantDAO {
    private final SqlSessionTemplate mybatis;

    // 연차 부여 등록
    public int insertAnnualLeaveGrant(AnnualLeaveGrantDTO dto) {
        return mybatis.insert("AnnualLeaveGrant.insertAnnualLeaveGrant", dto);
    }

    // annual_leave_grant 사용일수 업데이트
    public int updateAnnualLeaveGrantUsage(Map<String, Object> params) {
        return mybatis.update("AnnualLeaveGrant.updateAnnualLeaveGrantUsage", params);
    }

    // 가장 최근에 부여한 연차 부여 이력 조회
    public AnnualLeaveGrantDTO getLatestGrantByEmployee(String employeeId) {
        return mybatis.selectOne("AnnualLeaveGrant.getLatestGrantByEmployee", employeeId);
    }

    // 남은 연차 일수 조회
    public int getRemainingVacation(String employeeId) {
        return mybatis.selectOne("AnnualLeaveGrant.getRemainingVacation", employeeId);
    }

    // 직원별 연차 목록 조회
    public List<AnnualLeaveGrantDTO> getAnnualLeaveListByEmployeeId(String employeeId) {
        return mybatis.selectList("AnnualLeaveGrant.getAnnualLeaveListByEmployeeId", employeeId);
    }
}
