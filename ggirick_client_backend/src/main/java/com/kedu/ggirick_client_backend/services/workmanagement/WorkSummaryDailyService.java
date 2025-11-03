package com.kedu.ggirick_client_backend.services.workmanagement;

import com.google.gson.Gson;
import com.kedu.ggirick_client_backend.dao.workmanagement.WorkSummaryDailyDAO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalDTO;
import com.kedu.ggirick_client_backend.dto.workmanagement.*;
import com.kedu.ggirick_client_backend.services.approval.ApprovalService;
import com.kedu.ggirick_client_backend.utils.approval.DocDataUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkSummaryDailyService {

    private final WorkSummaryDailyDAO workSummaryDailyDAO;
    private final WorkTimeLogService workTimeLogService;
    private final EmployeeWorkPolicyService employeeWorkPolicyService;
    private final ApprovalService approvalService;
    private final WorkPlanService workPlanService;
    private final WorkAttendanceSummaryService workAttendanceSummaryService;
    private final DocDataUtil dataUtil;
    private final Gson gson;

    // 1. 하루 근무 요약 (스케줄러 / 일반 호출)
    @Transactional
    public void dailyWorkSummary(Date targetDate) {
        log.info("[WorkSummaryDailyService] {} 근무기록 요약 시작", targetDate);

        // 1. 근무정책 전체 조회
        List<EmployeeWorkPolicyDTO> policies = employeeWorkPolicyService.getAllWithPolicyDetails();

        // 2. 해당 날짜의 전체 근무기록 조회
        List<WorkTimeLogDTO> allLogs = workTimeLogService.getAllLogsByDate(targetDate);

        // 3. 직원별 근무요약 계산
        for (EmployeeWorkPolicyDTO policy : policies) {
            String empId = policy.getEmployeeId();

            // 직원별 로그 필터링
            List<WorkTimeLogDTO> logs = new ArrayList<>();
            for (WorkTimeLogDTO log : allLogs) {
                if (empId.equals(log.getEmployeeId())) {
                    logs.add(log);
                }
            }

            LocalTime startTime = policy.getWorkStartTime();
            LocalTime endTime = policy.getWorkEndTime();

            Timestamp start = null;
            Timestamp end = null;
            double totalHours = 0;
            double overtimeHours = 0;
            double nightHours = 0;
            double leaveHours = 0;
            String status = "NORMAL";

            Calendar cal = Calendar.getInstance();
            cal.setTime(targetDate);
            int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);

            // 4. 근무기록이 없는 경우
            if (logs.isEmpty()) {
                if (isWeekend(dayOfWeek)) continue;

                List<ApprovalDTO> vacDocs = approvalService.getApprovedDocsByEmployeeAndType(empId, "VAC");
                boolean hasVacation = false;
                for (ApprovalDTO doc : vacDocs) {
                    if (isDateInRange(targetDate, doc)) {
                        hasVacation = true;
                        break;
                    }
                }

                if (hasVacation) {
                    status = "LEAVE";
                    leaveHours = 8.0;
                } else {
                    status = "ABSENT";
                }
            } else {
                // 5. 출퇴근 로그 추출
                start = getFirstTimestamp(logs, "IN");
                end = getLastTimestamp(logs, "OUT");

                if (start == null && end == null) {
                    status = "ABSENT";
                } else if (end == null) {
                    status = "MISSING_OUT";
                    totalHours = 8.0;
                } else {
                    long diffMillis = end.getTime() - start.getTime();
                    totalHours = diffMillis / (1000.0 * 60 * 60);

                    LocalTime startLocal = start.toLocalDateTime().toLocalTime();
                    LocalTime endLocal = end.toLocalDateTime().toLocalTime();

                    // 지각
                    if (startLocal.isAfter(startTime.plusMinutes(10))) {
                        status = "LATE";
                    }

                    // 조퇴
                    if (endLocal.isBefore(endTime.minusHours(1))) {
                        if ("LATE".equals(status)) {
                            status = "LATE_EARLY_LEAVE";
                        } else {
                            status = "EARLY_LEAVE";
                        }
                    }

                    // 연장근무
                    List<ApprovalDTO> owrDocs = approvalService.getApprovedDocsByEmployeeAndType(empId, "OWR");
                    for (ApprovalDTO doc : owrDocs) {
                        if (!isDateInRange(targetDate, doc)) continue;
                        double[] ref = calculateOvertimeAndNightHours(empId, policy.getPolicyId(), doc);
                        overtimeHours = ref[0];
                        nightHours = ref[1];
                        status = (nightHours > 0) ? "NIGHT_WORK" : "OVERTIME_WORK";
                        break;
                    }

                    // 휴일근무
                    List<ApprovalDTO> hwrDocs = approvalService.getApprovedDocsByEmployeeAndType(empId, "HWR");
                    boolean hasHolidayWork = false;
                    for (ApprovalDTO doc : hwrDocs) {
                        if (isDateInRange(targetDate, doc)) {
                            hasHolidayWork = true;
                            break;
                        }
                    }

                    if (hasHolidayWork || isWeekend(dayOfWeek)) {
                        status = "HOLIDAY_WORK";
                    }

                    // 반차휴가 (지각/조퇴 시 4시간 인정)
                    if ("EARLY_LEAVE".equals(status) || "LATE".equals(status)) {
                        List<ApprovalDTO> vacDocs = approvalService.getApprovedDocsByEmployeeAndType(empId, "VAC");
                        for (ApprovalDTO doc : vacDocs) {
                            if (isDateInRange(targetDate, doc)) {
                                leaveHours = 4.0;
                                break;
                            }
                        }
                    }
                }
            }

            // 6. 근무요약 MERGE
            WorkSummaryDailyDTO summary = new WorkSummaryDailyDTO();
            summary.setEmployeeId(empId);
            summary.setWorkDate(targetDate);
            summary.setStartTime(start);
            summary.setEndTime(end);
            summary.setTotalHours(totalHours);
            summary.setOvertimeHours(overtimeHours);
            summary.setNightHours(nightHours);
            summary.setLeaveHours(leaveHours);
            summary.setStatus(status);
            workSummaryDailyDAO.merge(summary);

            // 7. 근태 상태 MERGE
            WorkAttendanceSummaryDTO attendance = new WorkAttendanceSummaryDTO();
            attendance.setEmployeeId(empId);
            attendance.setWorkDate(targetDate);
            attendance.setStatus(status);
            attendance.setWorkHours(totalHours);
            workAttendanceSummaryService.mergeWorkAttendanceSummary(attendance);
        }

        log.info("[WorkSummaryDailyService] {} 근무요약 완료", targetDate);
    }

    // 8. 연장/야간근무 계산 (근무정책 기준 4시간 or 3시간 구분)
    private double[] calculateOvertimeAndNightHours(String empId, Integer policyId, ApprovalDTO doc) {

        // JSON 파싱 추가
        parseDocDataIfNeeded(doc);

        double overtimeHours = 0;
        double nightHours = 0;

        Timestamp startTimestamp = dataUtil.convertToTimestamp(doc.getDocData(), true);
        Timestamp endTimestamp = dataUtil.convertToTimestamp(doc.getDocData(), false);
        if (startTimestamp == null || endTimestamp == null) return new double[]{0, 0};

        int threshold = (policyId != null && policyId == 2) ? 3 : 4;

        LocalDateTime startLdt = startTimestamp.toLocalDateTime();
        LocalDateTime endLdt = endTimestamp.toLocalDateTime();

        LocalDateTime sixPM = LocalDateTime.of(startLdt.toLocalDate(), LocalTime.of(18, 0));
        LocalDateTime nightBoundary = LocalDateTime.of(startLdt.toLocalDate(), LocalTime.of(22, 0));

        double after6Hours = 0;
        if (endLdt.isAfter(sixPM)) {
            Timestamp sixPMTs = Timestamp.valueOf(sixPM);
            long after6Millis = endTimestamp.getTime() - Math.max(startTimestamp.getTime(), sixPMTs.getTime());
            after6Hours = after6Millis / (1000.0 * 60 * 60);
        }

        double nightBoundaryHours = 0;
        if (endLdt.isAfter(nightBoundary)) {
            long nightMillis = endTimestamp.getTime() - Timestamp.valueOf(nightBoundary).getTime();
            nightBoundaryHours = nightMillis / (1000.0 * 60 * 60);
        }

        if (after6Hours <= threshold) {
            overtimeHours = after6Hours;
        } else {
            overtimeHours = threshold;
            nightHours = after6Hours - threshold;
        }

        if (nightBoundaryHours > 0 && nightHours < nightBoundaryHours) {
            nightHours = Math.max(nightHours, nightBoundaryHours);
        }

        return new double[]{overtimeHours, nightHours};
    }

    // 9. 출근/퇴근 로그 추출
    private Timestamp getFirstTimestamp(List<WorkTimeLogDTO> logs, String type) {
        Timestamp result = null;
        for (WorkTimeLogDTO log : logs) {
            if (type.equals(log.getType())) {
                if (result == null || log.getRecordedAt().before(result)) {
                    result = log.getRecordedAt();
                }
            }
        }
        return result;
    }

    private Timestamp getLastTimestamp(List<WorkTimeLogDTO> logs, String type) {
        Timestamp result = null;
        for (WorkTimeLogDTO log : logs) {
            if (type.equals(log.getType())) {
                if (result == null || log.getRecordedAt().after(result)) {
                    result = log.getRecordedAt();
                }
            }
        }
        return result;
    }

    // 10. 날짜 범위 체크
    private boolean isDateInRange(Date targetDate, ApprovalDTO doc) {
        try {
            // ✅ JSON → Map 보장
            parseDocDataIfNeeded(doc);

            Map<String, Object> data = doc.getDocData();
            if (data == null || data.isEmpty()) return false;

            LocalDate start = LocalDate.parse((String) data.get("startDate"));
            LocalDate end   = LocalDate.parse((String) data.get("endDate"));
            LocalDate target = targetDate.toLocalDate();

            return !target.isBefore(start) && !target.isAfter(end);
        } catch (Exception e) {
            log.warn("[WorkSummaryDailyService] 날짜 비교 실패: {}", e.getMessage());
            return false;
        }
    }

    // 11. 주말 체크
    private boolean isWeekend(int dayOfWeek) {
        return dayOfWeek == Calendar.SATURDAY || dayOfWeek == Calendar.SUNDAY;
    }

    // 12. 결재 승인 시 근무요약 반영
    @Transactional
    public void approveDailyWorkSummary(ApprovalDTO approvalInfo) {
        try {
            Map<String, Object> data = approvalInfo.getDocData();
            if (data == null) return;

            String startDateStr = (String) data.get("startDate");
            String endDateStr = (String) data.get("endDate");
            if (startDateStr == null || endDateStr == null) return;

            LocalDate startDate = LocalDate.parse(startDateStr);
            LocalDate endDate = LocalDate.parse(endDateStr);
            String docType = approvalInfo.getDocTypeCode();

            if (!("OWR".equals(docType) || "HWR".equals(docType) || "VAC".equals(docType))) return;

            String empId = approvalInfo.getWriter();
            LocalDate current = startDate;
            while (!current.isAfter(endDate)) {
                Date targetDate = Date.valueOf(current);
                log.info("[WorkSummaryDailyService] 승인결재 반영 중 → {} / 직원: {}", targetDate, empId);
                this.dailyWorkSummary(targetDate);
                current = current.plusDays(1);
            }

        } catch (Exception e) {
            log.error("[WorkSummaryDailyService] 결재 근무요약 반영 실패", e);
        }
    }

    // 13. 통계 조회용
    public WorkSummaryDTO getWorkSummary(String employeeId, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> params = new HashMap<>();
        params.put("employeeId", employeeId);
        params.put("startDate", Date.valueOf(startDate));
        params.put("endDate", Date.valueOf(endDate));

        WorkSummaryDTO summary = workSummaryDailyDAO.getWorkSummary(params);
        List<WorkPlanDTO> plans = workPlanService.getPlansByPeriod(employeeId, startDate, endDate);

        int totalPlannedHours = 0;
        for (WorkPlanDTO plan : plans) {
            LocalDateTime start = plan.getStartDateTime();
            LocalDateTime end = plan.getEndDateTime();
            if (start != null && end != null) {
                int diffHours = (int) Duration.between(start, end).toHours() - 1;
                if (diffHours < 0) diffHours = 0;
                totalPlannedHours += diffHours;
            }
        }

        summary.setTotalPlannedHours(totalPlannedHours);
        return summary;
    }

    // Approval 문서 JSON 파싱 (docDataJson → docData)
    private void parseDocDataIfNeeded(ApprovalDTO doc) {
        try {
            // 이미 파싱된 경우 스킵
            if (doc.getDocData() != null && !doc.getDocData().isEmpty()) return;

            // JSON 문자열이 비어있는 경우도 스킵
            if (doc.getDocDataJson() == null || doc.getDocDataJson().isBlank()) return;

            // Gson 또는 ObjectMapper 이용 (dataUtil에도 가능)
            Map<String, Object> parsed = gson.fromJson(doc.getDocDataJson(), Map.class);
            doc.setDocData(parsed);

            log.debug("[WorkSummaryDailyService] DOC_DATA 파싱 완료 (문서 ID: {})", doc.getId());
        } catch (Exception e) {
            log.warn("[WorkSummaryDailyService] DOC_DATA 파싱 실패 (문서 ID: {}): {}", doc.getId(), e.getMessage());
        }
    }
}
