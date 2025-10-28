package com.kedu.ggirick_client_backend.dao.workmanagement;

import com.kedu.ggirick_client_backend.dto.workmanagement.WorkSummaryDTO;
import com.kedu.ggirick_client_backend.dto.workmanagement.WorkSummaryDailyDTO;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class WorkSummaryDailyDAO {

    private final SqlSession mybatis;

    // 근무요약 MERGE (있으면 UPDATE, 없으면 INSERT)
    public int merge(WorkSummaryDailyDTO summary) {
        return mybatis.update("WorkSummaryDaily.merge", summary);
    }

    // 통계용
    public WorkSummaryDTO getWorkSummary(Map<String, Object> params) {
        return mybatis.selectOne("WorkSummaryDaily.getWorkSummary", params);
    }
}
