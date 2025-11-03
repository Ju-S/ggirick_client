package com.kedu.ggirick_client_backend.dao.hr;

import com.kedu.ggirick_client_backend.dto.hr.AnnualLeaveGrantDTO;
import com.kedu.ggirick_client_backend.dto.hr.VacationNotificationLogDTO;
import com.kedu.ggirick_client_backend.dto.hr.VacationUsageLogDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class VacationDAO {
    private final SqlSessionTemplate mybatis;

    // 휴가 사용 등록
    public int insertVacationUsageLog(VacationUsageLogDTO dto) {
        return mybatis.insert("Vacation.insertVacationUsageLog", dto);
    }

    // 휴가 사용 촉진 알림 등록
    public int insertVacationNotification(VacationNotificationLogDTO dto) {
        return mybatis.insert("Vacation.insertVacationNotification", dto);
    }

    // 휴가 사용 로그 단건 조회 (취소 복구용)
    public VacationUsageLogDTO getVacationUsageById(int usageId) {
        return mybatis.selectOne("Vacation.getVacationUsageById", usageId);
    }

    // 휴가 사용 로그 삭제 (취소 시)
    public int deleteVacationUsage(int usageId) {
        return mybatis.delete("Vacation.deleteVacationUsage", usageId);
    }
}
