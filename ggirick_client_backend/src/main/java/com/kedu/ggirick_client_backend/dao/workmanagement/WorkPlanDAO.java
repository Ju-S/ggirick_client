package com.kedu.ggirick_client_backend.dao.workmanagement;

import com.kedu.ggirick_client_backend.dto.workmanagement.WorkPlanDTO;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class WorkPlanDAO {

    private final SqlSession mybatis;

    // 기간별 근무계획 조회
    public List<WorkPlanDTO> getPlansByPeriod(String employeeId, String startDate, String endDate) {
        return mybatis.selectList("workmanagement.plan.getPlansByPeriod");
    }

    // 근무계획 등록
    public void insertPlan(WorkPlanDTO dto) {
        mybatis.insert("workmanagement.plan.insertPlan", dto);
    }

    // 근무계획 수정
    public void updatePlan(WorkPlanDTO dto) {
        mybatis.update("workmanagement.plan.updatePlan", dto);
    }

    // 근무계획 삭제
    public void deletePlan(Long planId) {
        mybatis.delete("workmanagement.plan.deletePlan", planId);
    }
}
