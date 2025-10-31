package com.kedu.ggirick_client_backend.dao.workmanagement;

import com.kedu.ggirick_client_backend.dto.workmanagement.WorkSummaryDTO;
import com.kedu.ggirick_client_backend.dto.workmanagement.WorkSearchConditionDTO;
import com.kedu.ggirick_client_backend.dto.workmanagement.WorkTimeLogDTO;
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
public class WorkTimeLogDAO {

    private final SqlSession mybatis;

    // 근무기록 insert
    public void insert(WorkTimeLogDTO dto) {
        mybatis.insert("WorkTimeLog.insert", dto);
    }

    // 단일 근무기록 조회 (insert 후 반환용)
    public WorkTimeLogDTO getWorkTimeLogById(Long id) {
        return mybatis.selectOne("WorkTimeLog.getWorkTimeLogById", id);
    }

    // 근무기록 수정
    public int update(WorkTimeLogDTO dto) {
        return mybatis.update("WorkTimeLog.update", dto);
    }

    // 근무기록 삭제
    public int delete(Long id) {
        return mybatis.delete("WorkTimeLog.delete", id);
    }

    // 오늘 내 근무 기록 전체 조회
    public List<WorkTimeLogDTO> getWorkTimeLogsByEmployeeId(String employeeId) {
        return mybatis.selectList("WorkTimeLog.getWorkTimeLogsByEmployeeId", employeeId);
    }

    // 특정 타입의 마지막 기록 (예: 마지막 출근 기록)
    public WorkTimeLogDTO getLastWorkTimeLogByType(Map<String, Object> params) {
        return mybatis.selectOne("WorkTimeLog.getLastWorkTimeLogByType", params);
    }

    // 조건 조회용 - 통합버전 (기간 + 조직/부서 등)
    public List<WorkTimeLogDTO> getWorkTimeLogsByCondition(WorkSearchConditionDTO condition) {
        return mybatis.selectList("WorkTimeLog.getWorkTimeLogsByCondition", condition);
    }

    // 특정 날짜의 모든 직원 근무기록 조회
    public List<WorkTimeLogDTO> getAllLogsByDate(Date targetDate) {
        return mybatis.selectList("WorkTimeLog.getAllLogsByDate", targetDate);
    }

    // 로그인한 id의 기간 + 근무유형 조건으로 근무기록 조회
    public List<WorkTimeLogDTO> getLogsByTypeAndPeriod(Map<String, Object> params) {
        return mybatis.selectList("WorkTimeLog.getLogsByTypeAndPeriod", params);
    }
}
