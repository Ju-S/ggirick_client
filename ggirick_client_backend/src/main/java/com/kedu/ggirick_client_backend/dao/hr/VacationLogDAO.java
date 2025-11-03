package com.kedu.ggirick_client_backend.dao.hr;

import com.kedu.ggirick_client_backend.dto.hr.VacationLogDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class VacationLogDAO {
    private final SqlSessionTemplate mybatis;

    // 휴가 로그 등록 - 기존 vacation_log 테이블에 기록 남기기 (UI/전자결재용)
    public int insertVacationLog(VacationLogDTO dto) {
        return mybatis.insert("VacationLog.insertVacationLog", dto);
    }

    // 휴가 로그 삭제 - 기존 vacation_log 테이블에서 기록 삭제 (usageId 기준)
    public int deleteVacationLog(int approvalId) {
        return mybatis.delete("VacationLog.deleteVacationLog", approvalId);
    }
}
