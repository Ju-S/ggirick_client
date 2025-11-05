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
import java.time.format.DateTimeFormatter;
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

    // 1. 하루 근무 요약 (스케줄러 / 수동 호출)
    @Transactional
    public void dailyWorkSummary(Date targetDate) {
        log.info("[WorkSummaryDailyService] {} 근무요약 시작", targetDate);

        // 근무정책 전체 조회
        List<EmployeeWorkPolicyDTO> policies = employeeWorkPolicyService.getAllWithPolicyDetails();

        // 해당 날짜 전체 근무기록 조회
        List<WorkTimeLogDTO> allLogs = workTimeLogService.getAllLogsByDate(targetDate);

        // 직원별 근무요약 생성
        for (EmployeeWorkPolicyDTO policy : policies) {
            String empId = policy.getEmployeeId();

            // 직원별 로그 필터링
            List<WorkTimeLogDTO> logs = new ArrayList<>();
            for (WorkTimeLogDTO log : allLogs) {
                if (empId.equals(log.getEmployeeId())) logs.add(log);
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

            // 근무로그가 없는 경우 → 휴가 또는 결근 판정
            if (logs.isEmpty()) {
                if (isWeekend(dayOfWeek)) continue;

                List<ApprovalDTO> vacDocs = approvalService.getApprovedDocsByEmployeeAndType(empId, "VAC");
                for (ApprovalDTO doc : vacDocs) {
                    if (isDateInRange(doc, targetDate, "VAC")) {
                        Map<String, Object> data = doc.getDocData();
                        String startDateStr = (String) data.get("startDate");
                        String endDateStr = (String) data.get("endDate");
                        String startTimeStr = (String) data.get("startTime");
                        String endTimeStr = (String) data.get("endTime");

                        LocalDate startDate = LocalDate.parse(startDateStr);
                        LocalDate endDate = LocalDate.parse(endDateStr);
                        LocalDate target = targetDate.toLocalDate();

                        LocalTime vacStart;
                        LocalTime vacEnd;

                        // 1일짜리 휴가
                        if (target.equals(startDate) && target.equals(endDate)) {
                            vacStart = LocalTime.parse(startTimeStr);
                            vacEnd = LocalTime.parse(endTimeStr);
                        }
                        // 첫날
                        else if (target.equals(startDate)) {
                            vacStart = LocalTime.parse(startTimeStr);
                            vacEnd = endTime;
                        }
                        // 마지막날
                        else if (target.equals(endDate)) {
                            vacStart = startTime;
                            vacEnd = LocalTime.parse(endTimeStr);
                        }
                        // 중간날
                        else {
                            vacStart = startTime;
                            vacEnd = endTime;
                        }

                        double policyHours = Duration.between(startTime, endTime).toHours();
                        double vacHours = Duration.between(vacStart, vacEnd).toHours();

                        // 휴가 시간 기준으로 상태 판정
                        if (vacHours >= policyHours - 1) { // 하루 전체 휴가
                            status = "LEAVE";
                            leaveHours = 8.0;
                        } else if (vacHours >= 3) { // 3시간 이상이면 반차로 인정
                            status = "HALF_LEAVE";
                            leaveHours = 4.0;
                        } else {
                            status = "ABSENT";
                        }

                        break;
                    }
                }

                if ("NORMAL".equals(status)) {
                    status = "ABSENT";
                }

            } else {
                // 출퇴근 로그 존재 시
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

                    // 점심시간 1시간 제외
                    totalHours = Math.max(totalHours - 1, 0);

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

                    // 연장근무 승인 확인
                    List<ApprovalDTO> owrDocs = approvalService.getApprovedDocsByEmployeeAndType(empId, "OWR");
                    for (ApprovalDTO doc : owrDocs) {
                        if (!isDateInRange(doc, targetDate, "OWR")) continue;
                        double[] ref = calculateOvertimeAndNightHours(policy, doc);
                        overtimeHours = ref[0];
                        nightHours = ref[1];
                        status = (nightHours > 0) ? "NIGHT_WORK" : "OVERTIME_WORK";
                        break;
                    }

                    // 휴일근무 확인
                    List<ApprovalDTO> hwrDocs = approvalService.getApprovedDocsByEmployeeAndType(empId, "HWR");
                    boolean hasHolidayWork = false;
                    for (ApprovalDTO doc : hwrDocs) {
                        if (isDateInRange(doc, targetDate, "HWR")) {
                            hasHolidayWork = true;
                            break;
                        }
                    }

                    if (hasHolidayWork || isWeekend(dayOfWeek)) {
                        status = "HOLIDAY_WORK";
                    }
                }
            }

            // 근무요약 MERGE
            workSummaryDailyDAO.merge(WorkSummaryDailyDTO.builder()
                    .employeeId(empId)
                    .workDate(targetDate)
                    .startTime(start)
                    .endTime(end)
                    .totalHours(totalHours)
                    .overtimeHours(overtimeHours)
                    .nightHours(nightHours)
                    .leaveHours(leaveHours)
                    .status(status)
                    .build());

            // 근태 요약 MERGE
            workAttendanceSummaryService.mergeWorkAttendanceSummary(WorkAttendanceSummaryDTO.builder()
                    .employeeId(empId)
                    .workDate(targetDate)
                    .status(status)
                    .workHours(totalHours)
                    .build());
        }

        log.info("[WorkSummaryDailyService] {} 근무요약 완료", targetDate);
    }

    // 연장 / 야간근무 계산 (근무정책 DTO 직접 전달)
    private double[] calculateOvertimeAndNightHours(EmployeeWorkPolicyDTO policy, ApprovalDTO doc) {
        Map<String, Object> data = doc.getDocData();

        try {
            // 프론트에서 받은 문자열 시간 파싱
            String startDateTimeStr = (String) data.get("startDateTime");
            String endDateTimeStr = (String) data.get("endDateTime");

            if (startDateTimeStr == null || endDateTimeStr == null) {
                System.out.println("[DEBUG] startDateTime 또는 endDateTime 누락 → 0 반환");
                return new double[]{0, 0};
            }

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
            LocalDateTime startLdt = LocalDateTime.parse(startDateTimeStr, formatter);
            LocalDateTime endLdt = LocalDateTime.parse(endDateTimeStr, formatter);

            // 근무정책에서 퇴근 기준시간 조회
            LocalTime startTime = policy.getWorkStartTime(); // 예: 09:00
            LocalTime endTime = policy.getWorkEndTime();     // 예: 18:00

            // 기준시간 계산
            LocalDateTime normalEnd = LocalDateTime.of(startLdt.toLocalDate(), endTime);
            LocalDateTime nightBoundary = LocalDateTime.of(startLdt.toLocalDate(), LocalTime.of(22, 0));

            // 퇴근 이후 근무 시간
            double afterWorkHours = 0;
            if (endLdt.isAfter(normalEnd)) {
                long afterWorkMillis = Timestamp.valueOf(endLdt).getTime() -
                        Math.max(Timestamp.valueOf(startLdt).getTime(),
                                Timestamp.valueOf(normalEnd).getTime());
                afterWorkHours = afterWorkMillis / (1000.0 * 60 * 60);
            }

            // 야간 근무 시간
            double nightBoundaryHours = 0;
            if (endLdt.isAfter(nightBoundary)) {
                long nightMillis = Timestamp.valueOf(endLdt).getTime() -
                        Timestamp.valueOf(nightBoundary).getTime();
                nightBoundaryHours = nightMillis / (1000.0 * 60 * 60);
            }

            // 정책별 threshold (정책 ID로 구분)
            int threshold = (policy.getPolicyId() != null && policy.getPolicyId() == 2) ? 3 : 4;

            double overtimeHours;
            double nightHours;

            if (afterWorkHours <= threshold) {
                overtimeHours = afterWorkHours;
                nightHours = 0;
            } else {
                overtimeHours = threshold;
                nightHours = afterWorkHours - threshold;
            }

            // 야간 보정
            if (nightBoundaryHours > 0 && nightHours < nightBoundaryHours) {
                nightHours = Math.max(nightHours, nightBoundaryHours);
            }

            System.out.printf("[DEBUG] empId=%s, start=%s, end=%s, endTime=%s, afterWork=%.2f, overtime=%.2f, night=%.2f%n",
                    policy.getEmployeeId(), startLdt, endLdt, endTime, afterWorkHours, overtimeHours, nightHours);

            return new double[]{overtimeHours, nightHours};

        } catch (Exception e) {
            System.out.println("[DEBUG] 연장/야간근무 계산 오류 → " + e.getMessage());
            e.printStackTrace();
            return new double[]{0, 0};
        }
    }

    // 출근/퇴근 로그 추출
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

    // 10. 날짜 범위 체크 (결재문서의 날짜+시간이 targetDate(YYYY-MM-DD)에 포함되는지)
    private boolean isDateInRange(ApprovalDTO doc, Date targetDate, String type) {
        System.out.println("======================================");
        System.out.println("[DEBUG] 실행된 문서 ID: " + doc.getId());
        System.out.println("[DEBUG] targetDate(Date): " + targetDate);

        if (doc == null || doc.getDocData() == null) {
            System.out.println("[DEBUG] docData가 null → false 반환");
            return false;
        }

        Map<String, Object> data = doc.getDocData();
        System.out.println("[DEBUG] docData 내용: " + data);

        try {
            LocalDate startDate;
            LocalDate endDate;

            // 휴가(VAC) 문서
            if (type.equals("VAC")) {
                String startDateStr = (String) data.get("startDate");
                String endDateStr = (String) data.get("endDate");

                System.out.println("[DEBUG] startDateStr=" + startDateStr + ", endDateStr=" + endDateStr);

                if (startDateStr == null || endDateStr == null) {
                    System.out.println("[DEBUG] startDate 또는 endDate 누락 → false 반환");
                    return false;
                }

                startDate = LocalDate.parse(startDateStr, DateTimeFormatter.ISO_LOCAL_DATE);
                endDate = LocalDate.parse(endDateStr, DateTimeFormatter.ISO_LOCAL_DATE);
            }

            // 외근/연장근무(OWR) 문서
            else if (type.equals("OWR")) {
                String startDateTimeStr = (String) data.get("startDateTime");
                String endDateTimeStr = (String) data.get("endDateTime");

                System.out.println("[DEBUG] startDateTimeStr=" + startDateTimeStr + ", endDateTimeStr=" + endDateTimeStr);

                if (startDateTimeStr == null || endDateTimeStr == null) {
                    System.out.println("[DEBUG] startDateTime 또는 endDateTime 누락 → false 반환");
                    return false;
                }

                // 프론트에서 yyyy-MM-dd'T'HH:mm 포맷으로 전달됨
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");

                LocalDateTime startDateTime = LocalDateTime.parse(startDateTimeStr, formatter);
                LocalDateTime endDateTime = LocalDateTime.parse(endDateTimeStr, formatter);

                startDate = startDateTime.toLocalDate();
                endDate = endDateTime.toLocalDate();
            }

            // 정의되지 않은 타입
            else {
                System.out.println("[DEBUG] 지원되지 않는 type: " + type);
                return false;
            }

            LocalDate target = targetDate.toLocalDate();

            System.out.println("[DEBUG] startDate(LocalDate): " + startDate);
            System.out.println("[DEBUG] endDate(LocalDate): " + endDate);
            System.out.println("[DEBUG] target(LocalDate): " + target);

            boolean inRange = !target.isBefore(startDate) && !target.isAfter(endDate);
            System.out.println("[DEBUG] 비교결과 inRange=" + inRange);
            System.out.println("======================================");
            return inRange;

        } catch (Exception e) {
            System.out.println("[DEBUG] 날짜 파싱 실패 → " + e.getMessage());
            e.printStackTrace();
            System.out.println("======================================");
            return false;
        }
    }

    // 주말 여부 체크
    private boolean isWeekend(int dayOfWeek) {
        return dayOfWeek == Calendar.SATURDAY || dayOfWeek == Calendar.SUNDAY;
    }

    // 12. 결재 승인 시 근무요약 반영
    @Transactional
    public void approveDailyWorkSummary(ApprovalDTO approvalInfo) {
        try {
            // 1. 결재문서 데이터 가져오기
            Map<String, Object> data = approvalInfo.getDocData();
            if (data == null) {
                log.warn("[WorkSummaryDailyService] DOC_DATA가 비어 있음 (문서 ID: {})", approvalInfo.getId());
                return;
            }

            // 2. 시작일 / 종료일 추출
            String startDateStr = (String) data.get("startDate");
            String endDateStr = (String) data.get("endDate");
            if (startDateStr == null || endDateStr == null) {
                log.warn("[WorkSummaryDailyService] startDate 또는 endDate 누락 (문서 ID: {})", approvalInfo.getId());
                return;
            }

            // 3. 문자열 → LocalDate 변환
            LocalDate startDate = LocalDate.parse(startDateStr);
            LocalDate endDate = LocalDate.parse(endDateStr);

            // 4. 문서 타입 확인 (연장근무, 휴일근무, 휴가만 처리)
            String docType = approvalInfo.getDocTypeCode();
            if (!("OWR".equals(docType) || "HWR".equals(docType) || "VAC".equals(docType))) {
                log.info("[WorkSummaryDailyService] 해당 문서타입({})은 근무요약 반영 대상 아님", docType);
                return;
            }

            // 5. 작성자(직원) 정보
            String empId = approvalInfo.getWriter();
            LocalDate current = startDate;

            // 6. 지정된 기간 동안 반복 처리
            while (!current.isAfter(endDate)) {
                Date targetDate = Date.valueOf(current);
                log.info("[WorkSummaryDailyService] 승인결재 반영 중 → {} / 직원: {}", targetDate, empId);

                // 하루 단위 근무요약 재계산
                this.dailyWorkSummary(targetDate);

                current = current.plusDays(1);
            }

            log.info("[WorkSummaryDailyService] 문서 {} 근무요약 반영 완료", approvalInfo.getId());

        } catch (Exception e) {
            log.error("[WorkSummaryDailyService] 결재 근무요약 반영 실패", e);
        }
    }

    // 14. 통계 조회용 (일간 / 주간 / 월간 / 연간)
    public WorkSummaryDTO getWorkSummary(String employeeId, LocalDate startDate, LocalDate endDate) {
        Map<String, Object> params = new HashMap<>();
        params.put("employeeId", employeeId);
        params.put("startDate", Date.valueOf(startDate));
        params.put("endDate", Date.valueOf(endDate));

        // 근무 요약 데이터 조회
        WorkSummaryDTO summary = workSummaryDailyDAO.getWorkSummary(params);
        if (summary == null) summary = new WorkSummaryDTO();

        // 근무계획(Plan) 데이터로 소정근로시간 계산
        List<WorkPlanDTO> plans = workPlanService.getPlansByPeriod(employeeId, startDate, endDate);

        int totalPlannedHours = 0;
        for (WorkPlanDTO plan : plans) {
            LocalDateTime start = plan.getStartDateTime();
            LocalDateTime end = plan.getEndDateTime();
            if (start != null && end != null) {
                int diffHours = (int) Duration.between(start, end).toHours() - 1; // 점심 1시간 제외
                if (diffHours < 0) diffHours = 0;
                totalPlannedHours += diffHours;
            }
        }

        summary.setTotalPlannedHours(totalPlannedHours);
        return summary;
    }

}
