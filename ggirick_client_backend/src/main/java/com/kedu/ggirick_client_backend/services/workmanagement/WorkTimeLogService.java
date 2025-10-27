package com.kedu.ggirick_client_backend.services.workmanagement;

import com.kedu.ggirick_client_backend.dao.workmanagement.WorkTimeLogDAO;
import com.kedu.ggirick_client_backend.dto.workmanagement.WorkSearchConditionDTO;
import com.kedu.ggirick_client_backend.dto.workmanagement.WorkTimeLogDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WorkTimeLogService {
    private final WorkTimeLogDAO workTimeLogDAO;

    // 근무기록 insert
    public WorkTimeLogDTO insert(WorkTimeLogDTO dto) {
        // 1. insert
        workTimeLogDAO.insert(dto);

        // 2. insert 한 id로 단일 조회 ( 프론트 반영용 )
        System.out.println("📌 INSERTED ID = " + dto.getId());
        return workTimeLogDAO.getWorkTimeLogById(dto.getId());
    }

    // 단일 근무기록 조회
    @Transactional(readOnly = true)
    public WorkTimeLogDTO getWorkTimeLogById(Long id) {
        return workTimeLogDAO.getWorkTimeLogById(id);
    }

    // 근무기록 수정
    public void update(WorkTimeLogDTO dto) {
        workTimeLogDAO.update(dto);
    }

    // 근무기록 삭제
    public void delete(Long logId) {
        workTimeLogDAO.delete(logId);
    }

    // 오늘 내 근무 기록 전체 조회
    public List<WorkTimeLogDTO> getWorkTimeLogsByEmployeeId(String employeeId) {
        return workTimeLogDAO.getWorkTimeLogsByEmployeeId(employeeId);
    }

    // 특정 타입의 마지막 기록 (예: 마지막 출근 기록)
    public WorkTimeLogDTO getLastWorkTimeLogByType(String employeeId, String type) {
        Map<String, Object> params = new HashMap<>();
        params.put("employeeId", employeeId);
        params.put("type", type);
        return workTimeLogDAO.getLastWorkTimeLogByType(params);
    }

    // 조건 조회용 - 통합버전 (기간 + 조직/부서 등)
    public List<WorkTimeLogDTO> getWorkTimeLogsByCondition(WorkSearchConditionDTO condition) {
        return workTimeLogDAO.getWorkTimeLogsByCondition(condition);
    }

}
