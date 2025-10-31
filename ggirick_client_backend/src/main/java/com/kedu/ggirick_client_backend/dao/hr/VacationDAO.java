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

    // 연차 부여 등록
    public int insertAnnualLeaveGrant(AnnualLeaveGrantDTO dto) {
        return mybatis.insert("Vacation.insertAnnualLeaveGrant", dto);
    }

    // 휴가 사용 등록
    public int insertVacationUsageLog(VacationUsageLogDTO dto) {
        return mybatis.insert("Vacation.insertVacationUsageLog", dto);
    }

    // 휴가 사용 촉진 알림 등록
    public int insertVacationNotification(VacationNotificationLogDTO dto) {
        return mybatis.insert("Vacation.insertVacationNotification", dto);
    }

    // 직원별 연차 목록 조회
    public List<AnnualLeaveGrantDTO> getAnnualLeaveByEmployee(String employeeId) {
        return mybatis.selectList("Vacation.getAnnualLeaveByEmployee", employeeId);
    }

    // 남은 연차 일수 조회
    public int getRemainingVacation(String employeeId) {
        return mybatis.selectOne("Vacation.getRemainingVacation", employeeId);
    }

    // 현재까지 사용된 일수 조회
    public int getUsedDays(Long grantId) {
        return mybatis.selectOne("Vacation.getUsedDays", grantId);
    }

    // 사용일수 갱신 (days_used 업데이트)
    public int updateUsedDays(Long grantId, int daysUsed) {
        Map<String, Object> params = new HashMap<>();
        params.put("grantId", grantId);
        params.put("daysUsed", daysUsed);
        return mybatis.update("Vacation.updateUsedDays", params);
    }

    /** 휴가 사용 로그 단건 조회 (취소 복구용) */
    public VacationUsageLogDTO getVacationUsageById(Long usageId) {
        return mybatis.selectOne("Vacation.getVacationUsageById", usageId);
    }

    /** 휴가 사용 로그 삭제 (취소 시) */
    public int deleteVacationUsage(Long usageId) {
        return mybatis.delete("Vacation.deleteVacationUsage", usageId);
    }
}
