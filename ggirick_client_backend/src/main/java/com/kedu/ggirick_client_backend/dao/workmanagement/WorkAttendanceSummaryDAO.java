package com.kedu.ggirick_client_backend.dao.workmanagement;

import com.kedu.ggirick_client_backend.dto.workmanagement.WorkAttendanceSummaryDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class WorkAttendanceSummaryDAO {
    private final SqlSessionTemplate mybatis;

    public int mergeWorkAttendanceSummary(WorkAttendanceSummaryDTO dto) {
        return mybatis.update("WorkAttendanceSummary.mergeWorkAttendanceSummary", dto);
    }
}
