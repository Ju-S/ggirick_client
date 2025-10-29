package com.kedu.ggirick_client_backend.dao.workmanagement;

import com.kedu.ggirick_client_backend.dto.workmanagement.WorkPlanDTO;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class WorkPlanDAO {

    private final SqlSession mybatis;

    // 기간별 근무계획 조회
    public List<WorkPlanDTO> getPlansByPeriod(Map<String, Object> params) {
        return mybatis.selectList("WorkPlan.getPlansByPeriod", params);
    }

    // 근무계획 등록
    public void insertPlan(WorkPlanDTO dto) {
        mybatis.insert("WorkPlan.insertPlan", dto);
    }

    // 근무계획 수정
    public void updatePlan(WorkPlanDTO dto) {
        mybatis.update("WorkPlan.updatePlan", dto);
    }

    // 근무계획 삭제
    public void deletePlan(Date planDate) {
        mybatis.delete("WorkPlan.deletePlan", planDate);
    }

    // 해당일자 계획 존재여부 확인
    public boolean exists(String employeeId, Date planDate) {
        Map<String, Object> params = new HashMap<>();
        params.put("employeeId", employeeId);
        params.put("planDate", planDate);
        return (Integer)mybatis.selectOne("WorkPlan.exists", params) > 0;
    }
}
