package com.kedu.ggirick_client_backend.services.hr;

import com.kedu.ggirick_client_backend.dao.hr.EmployeeVacationDAO;
import com.kedu.ggirick_client_backend.dao.hr.VacationDAO;
import com.kedu.ggirick_client_backend.dao.hr.VacationLogDAO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalDTO;
import com.kedu.ggirick_client_backend.dto.hr.*;
import com.kedu.ggirick_client_backend.utils.approval.DocDataUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * VacationService
 * 인사 모듈 - 연차 자동 부여, 휴가 사용, 취소 처리 담당
 */
@Service
@RequiredArgsConstructor
public class VacationService {

    private final VacationDAO vacationDAO;
    private final VacationLogDAO vacationLogDAO;
    private final AnnualLeaveGrantService annualLeaveGrantService;
    private final EmployeeService employeeService;
    private final EmployeeVacationService employeeVacationService;
    private final DocDataUtil dateUtil;

    // 입사일 기준 연차 자동 계산 및 등록
    // 입사시 or 입사일 수정시 - 입사일 기준으로 연차 생성
    @Transactional
    public void registerAnnualLeaveByHireDate(String employeeId) {
        EmployeeDTO employeeDTO = employeeService.getEmployeeInfo(employeeId);
        if (employeeDTO == null) return;

        // 1. 입사일 확인 로그
        Date hireDate = employeeDTO.getHireDate();
        System.out.println("입사일 기준 연차 계산 시작");
        System.out.println("Hire Date: " + hireDate);

        // 2. 근속연수 계산
        LocalDate hireLocalDate = hireDate.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
        LocalDate now = LocalDate.now();

        int years = Period.between(hireLocalDate, now).getYears();
        System.out.println("근속연수(years): " + years);

        // 1년 미만: 0일 / 1년차: 15일 / 이후 2년에 1일씩 가산
        int daysGranted;
        if (years < 1) {
            daysGranted = 0;
        } else {
            int extra = (years - 1) / 2;
            daysGranted = Math.min(25, 15 + extra);
        }

        System.out.println("계산된 연차일수(daysGranted): " + daysGranted);

        // 3. DTO 세팅
        AnnualLeaveGrantDTO dto = new AnnualLeaveGrantDTO();
        dto.setEmployeeId(employeeId);
        dto.setDaysGranted(daysGranted);
        dto.setGrantDate(Date.from(Instant.now()));
        dto.setExpireDate(Date.from(Instant.now().plus(365, ChronoUnit.DAYS)));
        dto.setReason("입사일 기준 자동 부여");

        // 4. 등록 실행
        registerAnnualLeave(dto);

        // 5. 잔여 휴가 갱신
        employeeVacationService.updateRemaining(employeeId);
    }

    // 입사일 기준 연차 자동 계산 및 등록
    // 입사 1년 미만: 월 개근 1일씩
    // 입사 1년 이상: 15일 + 근속 2년마다 1일 추가 ( 최대 25일 )
    // 입사일 기준 잔여휴가 갱신
    @Transactional
    public boolean registerAnnualLeave(AnnualLeaveGrantDTO dto) {

        // 1. 직원 정보 조회 및 유효성 검사
        EmployeeDTO employeeDTO = employeeService.getEmployeeInfo(dto.getEmployeeId());
        if (employeeDTO == null || employeeDTO.getHireDate() == null) {
            throw new IllegalArgumentException("직원 정보가 존재하지 않습니다.");
        }

        // 2. 입사일(LocalDate) 및 오늘 날짜 변환
        LocalDate hireDate = employeeDTO.getHireDate().toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
        LocalDate today = LocalDate.now();

        // 3. 근속연수 및 개월 수 계산
        long years = ChronoUnit.YEARS.between(hireDate, today);   // 근속 연수
        long months = ChronoUnit.MONTHS.between(hireDate, today); // 총 개월 수

        int daysGranted = 0;

        // 4. 연차 계산 로직
        if (years < 1) {
            // 입사 1년 미만: 월 1일씩 (최대 11개월)
            daysGranted = (int) Math.min(months, 11);
        } else {
            // 입사 1년 이상: 기본 15일 + 2년마다 1일 가산 (최대 25일)
            daysGranted = 15 + (int) ((years - 1) / 2);
            if (daysGranted > 25) {
                daysGranted = 25;
            }
        }

        // 5. 부여 정보 세팅
        dto.setGrantDate(new Date()); // 부여일자 = 오늘
        dto.setExpireDate(java.sql.Date.valueOf(today.plusYears(1))); // 소멸일자 = +1년
        dto.setDaysGranted(daysGranted); // 계산된 부여일수
        dto.setDaysUsed(0); // 초기 사용일수 0
        dto.setReason("입사일 기준 자동 부여"); // 부여 사유

        // 6. 연차 부여 기록 등록 (annual_leave_grant)
        boolean inserted = annualLeaveGrantService.insertAnnualLeaveGrant(dto) > 0;

        // 7. 등록 성공 시 employee_vacation 잔여 연차 갱신
        if (inserted) {
            employeeVacationService.updateRemaining(dto.getEmployeeId());
        }

        return inserted;
    }

    // 전자결재 승인 시 휴가 사용 반영
    @Transactional
    public void applyApprovedVacation(ApprovalDTO approvalInfo) {
        VacationUsageLogDTO usage = this.buildVacationUsageDTO(approvalInfo);
        if (usage != null) {
            // 1. 휴가 사용 기록 (vacation_usage_log)
            this.insertVacationUsageLog(usage);

            // 2. 연차 사용일 업데이트 (annual_leave_grant)
            this.updateAnnualLeaveGrant(usage);

            // 3. 직원 잔여 연차 갱신 (employee_vacation)
            this.updateEmployeeVacation(usage.getEmployeeId());

            // 4. 전자결재/조회용 로그 기록 (vacation_log)
            this.insertVacationLog(usage);
        }
    }

    // 결재 문서 기반 DTO 생성
    private VacationUsageLogDTO buildVacationUsageDTO(ApprovalDTO approvalInfo) {

        // 1. 결재문서에서 직원 ID, 휴가 정보 추출
        String empId = approvalInfo.getWriter();
        Map<String, Object> docData = approvalInfo.getDocData();

        // 2. 문자열 날짜·시간 → Timestamp 변환
        Timestamp startTimestamp = dateUtil.convertToTimestamp(docData, true);
        Timestamp endTimestamp = dateUtil.convertToTimestamp(docData, false);

        // 3. 기간 차이 계산 (밀리초 → 일수)
        long diffMillis = endTimestamp.getTime() - startTimestamp.getTime();
        double diffDays = diffMillis / (1000.0 * 60 * 60 * 24);

        // 4. 반차 / 연차 타입 지정
        String vacationType = (diffDays % 1.0 != 0) ? "HALF" : "FULL";

        // 5. 최신 연차 부여 이력 조회
        AnnualLeaveGrantDTO grantDTO = annualLeaveGrantService.getLatestGrantByEmployee(empId);
        if (grantDTO == null) {
            System.out.println("연차 부여 이력이 없습니다. 휴가 반영 불가: " + empId);
            return null;
        }

        // 6. 유효기간 / 남은 연차 확인
        Date now = new Date();
        boolean isExpired = grantDTO.getExpireDate().before(now); // 유효기간 만료 여부
        boolean hasNoRemaining = grantDTO.getDaysGranted() <= grantDTO.getDaysUsed(); // 남은 연차 없음

        if (isExpired || hasNoRemaining) {
            System.out.println("사용 가능한 연차가 없습니다. (유효기간 만료 or 모두 소진)");
            return null;
        }

        // 7. DTO 생성 및 값 세팅
        VacationUsageLogDTO dto = new VacationUsageLogDTO();
        dto.setEmployeeId(empId);
        dto.setApprovalId(approvalInfo.getId());
        dto.setStartDate(startTimestamp);
        dto.setEndDate(endTimestamp);
        dto.setDaysUsed(diffDays);
        dto.setVacationType(vacationType);
        dto.setGrantId(grantDTO.getGrantId());

        return dto;
    }

    // vacation_usage_log 테이블 insert
    private void insertVacationUsageLog(VacationUsageLogDTO dto) {
        vacationDAO.insertVacationUsageLog(dto);
    }

    // annual_leave_grant 사용일수 업데이트
    private void updateAnnualLeaveGrant(VacationUsageLogDTO dto) {
        AnnualLeaveGrantDTO grant = annualLeaveGrantService.getLatestGrantByEmployee(dto.getEmployeeId());
        if (grant == null) return;

        double updatedUsed = grant.getDaysUsed() + dto.getDaysUsed();

        Map<String, Object> params = new HashMap<>();
        params.put("grantId", grant.getGrantId());
        params.put("daysUsed", updatedUsed);
        annualLeaveGrantService.updateAnnualLeaveGrantUsage(params);
    }

    // employee_vacation 테이블 잔여 연차 갱신
    private void updateEmployeeVacation(String employeeId) {
        employeeVacationService.updateRemaining(employeeId);
    }

    // vacation_log 테이블 기록 (전자결재/조회용)
    private void insertVacationLog(VacationUsageLogDTO dto) {
        VacationLogDTO log = new VacationLogDTO();
        log.setEmployeeId(dto.getEmployeeId());
        log.setApprovalId(dto.getApprovalId());

        vacationLogDAO.insertVacationLog(log);
    }

    // 휴가 결재 취소시 복구 처리
    @Transactional
    public boolean cancelVacationUsage(int usageId, String employeeId) {
        // 1. 기존 휴가 사용 로그 조회
        VacationUsageLogDTO usageLog = vacationDAO.getVacationUsageById(usageId);
        if (usageLog == null) throw new IllegalArgumentException("휴가 기록 없음");

        // 2. 연차 부여 이력 조회
        AnnualLeaveGrantDTO grantDTO = annualLeaveGrantService.getLatestGrantByEmployee(employeeId);
        if (grantDTO == null) {
            System.out.println("연차 부여 이력이 없습니다. 복구 불가: " + employeeId);
            return false;
        }

        // 3. 기존 사용일 차감 계산
        double usedDays = usageLog.getDaysUsed();
        double currentUsed = grantDTO.getDaysUsed();
        double newUsed = Math.max(currentUsed - usedDays, 0);

        // 4. annual_leave_grant 사용일수 갱신
        Map<String, Object> params = new HashMap<>();
        params.put("grantId", grantDTO.getGrantId());
        params.put("daysUsed", newUsed);
        annualLeaveGrantService.updateAnnualLeaveGrantUsage(params);

        // 5. vacation_usage_log 삭제
        vacationDAO.deleteVacationUsage(usageId);

        // 6. employee_vacation 잔여연차 재계산
        employeeVacationService.updateRemaining(usageLog.getEmployeeId());

        // 7. vacation_log 기록 삭제
        vacationLogDAO.deleteVacationLog(usageId);

        return true;
    }

    // 전체 직원 휴가 부여 이력 조회
    public List<AnnualLeaveGrantDTO> getAnnualLeaveListByEmployeeId(String employeeId) {
        return annualLeaveGrantService.getAnnualLeaveListByEmployeeId(employeeId);
    }

    // 잔여휴가 조회
    public int getRemainingVacation(String employeeId) {
        return annualLeaveGrantService.getRemainingVacation(employeeId);
    }
}
