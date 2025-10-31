package com.kedu.ggirick_client_backend.services.workmanagement;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.kedu.ggirick_client_backend.dao.workmanagement.WorkSummaryDailyDAO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalDTO;
import com.kedu.ggirick_client_backend.dto.workmanagement.*;
import com.kedu.ggirick_client_backend.services.approval.ApprovalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Type;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WorkSummaryDailyService {

    private final WorkSummaryDailyDAO workSummaryDailyDAO;

    private final WorkTimeLogService workTimeLogService;
    private final EmployeeWorkPolicyService employeeWorkPolicyService;
    private final ApprovalService approvalService;
    private final WorkPlanService workPlanService;

    private final Gson gson = new Gson();

    @Transactional
    public void aggregateDailyWorkSummary(Date targetDate) {
        log.info("[WorkSummaryDailyService] {} 근무기록 요약 시작 🚀", targetDate);

        // 1️⃣ 근무정책 전체 조회
        Map<String, EmployeeWorkPolicyDTO> policyMap =
                employeeWorkPolicyService.getAllWithPolicyDetails().stream()
                        .collect(Collectors.toMap(EmployeeWorkPolicyDTO::getEmployeeId, p -> p));

        // 2️⃣ 전 직원 근무기록 조회
        List<WorkTimeLogDTO> allLogs = workTimeLogService.getAllLogsByDate(targetDate);

        // 3️⃣ 직원별 로그 그룹핑
        Map<String, List<WorkTimeLogDTO>> logsByEmployee =
                allLogs.stream().collect(Collectors.groupingBy(WorkTimeLogDTO::getEmployeeId));

        // 4️⃣ 직원별 근무요약 계산
        for (String empId : policyMap.keySet()) {
            EmployeeWorkPolicyDTO policy = policyMap.get(empId);
            List<WorkTimeLogDTO> logs = logsByEmployee.getOrDefault(empId, new ArrayList<>());

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

            // 🟡 근무기록 없음 → 휴가 or 결근
            if (logs.isEmpty()) {
                if (dayOfWeek == Calendar.SATURDAY || dayOfWeek == Calendar.SUNDAY) continue;

                // ✅ ApprovalService 호출
                List<ApprovalDTO> vacationDocs = approvalService.getApprovedDocsByEmployeeAndType(empId, "VAC");
                boolean approvedVacation = false;

                for (ApprovalDTO doc : vacationDocs) {
                    try {
                        Type type = new TypeToken<Map<String, Object>>() {
                        }.getType();
                        Map<String, Object> data = gson.fromJson(doc.getDocDataJson(), type);

                        if (data == null) continue; // ✅ NPE 방지

                        LocalDate startDate = LocalDate.parse((String) data.get("startDate"));
                        LocalDate endDateJson = LocalDate.parse((String) data.get("endDate"));

                        if (!targetDate.toLocalDate().isBefore(startDate)
                                && !targetDate.toLocalDate().isAfter(endDateJson)) {
                            approvedVacation = true;
                            break;
                        }
                    } catch (Exception e) {
                        log.warn("[WorkSummaryDailyService] VAC JSON 파싱 실패: {}", e.getMessage());
                    }
                }

                if (approvedVacation) {
                    status = "LEAVE";
                    leaveHours = 8.0;
                } else {
                    status = "ABSENT";
                }
            } else {
                // 🟢 출근/퇴근 로그 추출
                start = logs.stream()
                        .filter(l -> "IN".equals(l.getType()))
                        .map(WorkTimeLogDTO::getRecordedAt)
                        .min(Timestamp::compareTo)
                        .orElse(null);

                end = logs.stream()
                        .filter(l -> "OUT".equals(l.getType()))
                        .map(WorkTimeLogDTO::getRecordedAt)
                        .max(Timestamp::compareTo)
                        .orElse(null);

                if (start == null && end == null) {
                    status = "ABSENT";
                } else if (end == null) {
                    status = "MISSING_OUT";
                    totalHours = 8.0;
                } else {
                    LocalTime startLocal = start.toLocalDateTime().toLocalTime();
                    LocalTime endLocal = end.toLocalDateTime().toLocalTime();

                    long diffMillis = end.getTime() - start.getTime();
                    totalHours = diffMillis / (1000.0 * 60 * 60);

                    // 🔹 지각
                    if (startLocal.isAfter(startTime.plusMinutes(10))) {
                        status = "LATE";
                    }

                    // 🔹 조퇴
                    if (endLocal.isBefore(endTime.minusHours(1))) {
                        status = ("LATE".equals(status)) ? "LATE_EARLY_LEAVE" : "EARLY_LEAVE";
                    }

                    // 🔹 연장근무
                    if (endLocal.isAfter(endTime.plusHours(1))) {
                        List<ApprovalDTO> overtimeDocs = approvalService.getApprovedDocsByEmployeeAndType(empId, "OWR");
                        for (ApprovalDTO doc : overtimeDocs) {
                            try {
                                Type type = new TypeToken<Map<String, Object>>() {
                                }.getType();
                                Map<String, Object> data = gson.fromJson(doc.getDocDataJson(), type);
                                if (data == null) continue;

                                LocalDate startDate = LocalDate.parse((String) data.get("startDate"));
                                LocalDate endDateJson = LocalDate.parse((String) data.get("endDate"));

                                if (!targetDate.toLocalDate().isBefore(startDate)
                                        && !targetDate.toLocalDate().isAfter(endDateJson)) {

                                    String startTimeStr = (String) data.get("startTime");
                                    String endTimeStr = (String) data.get("endTime");

                                    double startHour = Double.parseDouble(startTimeStr.split(":")[0])
                                            + Double.parseDouble(startTimeStr.split(":")[1]) / 60.0;
                                    double endHour = Double.parseDouble(endTimeStr.split(":")[0])
                                            + Double.parseDouble(endTimeStr.split(":")[1]) / 60.0;

                                    overtimeHours = endHour - startHour;
                                    break;
                                }
                            } catch (Exception e) {
                                log.warn("[WorkSummaryDailyService] OWR JSON 파싱 실패: {}", e.getMessage());
                            }
                        }

                        // 🔹 야간근무 (전자결재 승인된 문서 기준)
                        List<ApprovalDTO> nightDocs = approvalService.getApprovedDocsByEmployeeAndType(empId, "HWR");
                        for (ApprovalDTO doc : nightDocs) {
                            try {
                                Type type = new TypeToken<Map<String, Object>>() {
                                }.getType();
                                Map<String, Object> data = gson.fromJson(doc.getDocDataJson(), type);
                                if (data == null) continue;

                                LocalDate startDate = LocalDate.parse((String) data.get("startDate"));
                                LocalDate endDateJson = LocalDate.parse((String) data.get("endDate"));

                                if (!targetDate.toLocalDate().isBefore(startDate)
                                        && !targetDate.toLocalDate().isAfter(endDateJson)) {

                                    String startTimeStr = (String) data.get("startTime");
                                    String endTimeStr = (String) data.get("endTime");

                                    double startHour = Double.parseDouble(startTimeStr.split(":")[0])
                                            + Double.parseDouble(startTimeStr.split(":")[1]) / 60.0;
                                    double endHour = Double.parseDouble(endTimeStr.split(":")[0])
                                            + Double.parseDouble(endTimeStr.split(":")[1]) / 60.0;

                                    nightHours = endHour - startHour;
                                    status = "NIGHT_WORK";
                                    break;
                                }
                            } catch (Exception e) {
                                log.warn("[WorkSummaryDailyService] HWR JSON 파싱 실패: {}", e.getMessage());
                            }
                        }
                    }

                    // 🔹 주말 근무
                    if (dayOfWeek == Calendar.SATURDAY || dayOfWeek == Calendar.SUNDAY) {
                        status = "HOLIDAY_WORK";
                    }
                }
            }

            // 5️⃣ MERGE
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
        }

        log.info("[WorkSummaryDailyService] {} 근무요약 완료 ✅", targetDate);
    }

    // 통계용
    public WorkSummaryDTO getWorkSummary(String employeeId, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> params = new HashMap<>();
        params.put("employeeId", employeeId);
        params.put("startDate", Date.valueOf(startDate));
        params.put("endDate", Date.valueOf(endDate)); // endDate 포함

        WorkSummaryDTO summary = workSummaryDailyDAO.getWorkSummary(params);

        // 근무계획 조회
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
}
