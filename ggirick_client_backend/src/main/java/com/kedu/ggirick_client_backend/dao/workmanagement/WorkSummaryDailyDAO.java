package com.kedu.ggirick_client_backend.dao.workmanagement;

import lombok.RequiredArgsConstructor;
import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Repository
@RequiredArgsConstructor
public class WorkSummaryDailyDAO {

    private final SqlSession mybatis;

    /**
     * 전일 근무기록 집계 후 WORK_SUMMARY_DAILY에 MERGE
     */
    public int aggregateDailyWorkSummary(LocalDate targetDate) {
        return mybatis.update("WorkSummaryDaily.aggregateDailyWorkSummary", targetDate);
    }
}
