package com.kedu.ggirick_client_backend.services.dashboard;

import com.kedu.ggirick_client_backend.dto.approval.ApprovalDTO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalHistoryDTO;
import com.kedu.ggirick_client_backend.dto.board.BoardDTO;
import com.kedu.ggirick_client_backend.dto.board.BoardGroupDTO;
import com.kedu.ggirick_client_backend.dto.calendar.CalendarDTO;
import com.kedu.ggirick_client_backend.dto.calendar.CalendarGroupDTO;
import com.kedu.ggirick_client_backend.dto.dashboard.ActivityDTO;
import com.kedu.ggirick_client_backend.dto.task.ProjectDTO;
import com.kedu.ggirick_client_backend.dto.task.TaskDTO;
import com.kedu.ggirick_client_backend.services.approval.ApprovalHistoryService;
import com.kedu.ggirick_client_backend.services.approval.ApprovalService;
import com.kedu.ggirick_client_backend.services.board.BoardGroupService;
import com.kedu.ggirick_client_backend.services.board.BoardService;
import com.kedu.ggirick_client_backend.services.calendar.CalendarGroupService;
import com.kedu.ggirick_client_backend.services.calendar.CalendarService;
import com.kedu.ggirick_client_backend.services.reservation.ReservationService;
import com.kedu.ggirick_client_backend.services.task.TaskProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final CalendarService calendarService;
    private final CalendarGroupService calendarGroupService;
    private final BoardService boardService;
    private final BoardGroupService boardGroupService;
    private final ApprovalHistoryService approvalHistoryService;
    private final ApprovalService approvalService;
    private final ReservationService reservationService;
    private final TaskProjectService taskProjectService;

    // region 일정 관련
    // 오늘의 일정 갯수
    // 다가오는 3개의 일정 반환
    public Map<String, Object> getScheduleInfo(String userId) {
        Map<String, Object> scheduleInfo = new HashMap<>();

        List<CalendarDTO> scheduleList = getList(userId);

        ZoneId KST = ZoneId.of("Asia/Seoul");
        LocalDateTime now = LocalDateTime.now(KST);
        LocalDate todayDate = now.toLocalDate();

        // 오늘 일정 개수
        long todayCount = scheduleList.stream()
                .filter(e -> {
                    LocalDate start = e.getStartAt().toLocalDateTime().toLocalDate();
                    LocalDate end = e.getEndAt() != null ? e.getEndAt().toLocalDateTime().toLocalDate() : start; // endAt 없으면 start만
                    return !todayDate.isBefore(start) && !todayDate.isAfter(end);
                })
                .count();

        // 다가오는 일정 3개 (현재 시점 이후 기준)
        List<CalendarDTO> upcomingList = scheduleList.stream()
                .filter(e -> e.getStartAt().toLocalDateTime().isAfter(now))
                .sorted(Comparator.comparing(CalendarDTO::getStartAt))
                .limit(3)
                .toList();

        scheduleInfo.put("todayScheduleSize", todayCount);
        scheduleInfo.put("upcomingScheduleList", upcomingList);

        return scheduleInfo;
    }

    // 일정 리스트 반환(반복일정 확장까지 다 한것으로)
    public List<CalendarDTO> getList(String userId) {
        List<CalendarDTO> scheduleList = calendarService.getListByUserId(userId);
        List<CalendarGroupDTO> calendarGroupList = calendarGroupService.getListByUserId(userId);
        for (CalendarGroupDTO calendarGroup : calendarGroupList) {
            scheduleList.addAll(calendarService.getListByGroupId(calendarGroup.getId()));
        }

        return expandRecurrence(scheduleList);
    }

    // 반복일정 확장(오늘 이전은 제외)
    public List<CalendarDTO> expandRecurrence(List<CalendarDTO> originalList) {
        ZoneId KST = ZoneId.of("Asia/Seoul");
        LocalDate today = LocalDate.now(KST); // 오늘 날짜만 비교

        List<CalendarDTO> expandedList = new ArrayList<>();

        for (CalendarDTO item : originalList) {
            LocalDateTime start = item.getStartAt().toLocalDateTime();
            LocalDateTime end = item.getEndAt().toLocalDateTime();
            LocalDateTime recurrenceEnd = item.getRecurrenceEnd() != null
                    ? item.getRecurrenceEnd().toLocalDateTime()
                    : start.plusMonths(6); // 기본 6개월까지만 확장

            while (!start.isAfter(recurrenceEnd)) {
                // 오늘 포함 여부 비교 (날짜만 비교)
                if (!start.toLocalDate().isBefore(today)) {
                    expandedList.add(copySchedule(item, start, end));
                }

                if (item.getRecurrence().equalsIgnoreCase("none")) {
                    break;
                }

                switch (item.getRecurrence()) {
                    case "daily" -> {
                        start = start.plusDays(1);
                        end = end.plusDays(1);
                    }
                    case "weekly" -> {
                        start = start.plusWeeks(1);
                        end = end.plusWeeks(1);
                    }
                    case "monthly" -> {
                        start = start.plusMonths(1);
                        end = end.plusMonths(1);
                    }
                    case "yearly" -> {
                        start = start.plusYears(1);
                        end = end.plusYears(1);
                    }
                    default -> {
                        // 변경 없음
                    }
                }
            }
        }
        return expandedList;
    }

    // 일정 복사
    public CalendarDTO copySchedule(CalendarDTO original, LocalDateTime start, LocalDateTime end) {
        return CalendarDTO.builder()
                .startAt(Timestamp.valueOf(start))
                .endAt(Timestamp.valueOf(end))
                .title(original.getTitle())
                .name(original.getName())
                .groupId(original.getGroupId())
                .color(original.getColor())
                .build();
    }
    // endregion

    // region 게시글 관련
    // 최신 공지글 하나 조회
    public BoardDTO getRecentNotification(String userId) {
        List<BoardGroupDTO> boardGroupList = boardGroupService.getGroupList(userId);
        List<BoardDTO> notificationList = new ArrayList<>(boardService.getNotificationList(1));

        for (BoardGroupDTO boardGroup : boardGroupList) {
            notificationList.addAll(boardService.getNotificationList(boardGroup.getId()));
        }

        notificationList.sort(Comparator.comparing(BoardDTO::getCreatedAt).reversed());

        if(notificationList.isEmpty()) {
            return null;
        }
        return notificationList.get(0);
    }

    // endregion

    // region 결재 관련
    public List<Map<String, Object>> getRecentApprovalHistory(String userId) {
        List<ApprovalHistoryDTO> historyList = approvalHistoryService.getRecentHistory(userId);
        List<ApprovalDTO> approvalList = historyList.stream()
                .map(history -> approvalService.getById(history.getApprovalId()))
                .toList();

        List<Map<String, Object>> approvalInfos = new ArrayList<>();

        for (int i = 0; i < historyList.size(); i++) {
            ApprovalHistoryDTO history = historyList.get(i);
            ApprovalDTO approval = approvalList.get(i);

            Map<String, Object> map = new HashMap<>();
            map.put("history", history);
            map.put("approval", approval);

            approvalInfos.add(map);
        }

        return approvalInfos;
    }

    // endregion

    // region 최근 활동(3개)
    public List<ActivityDTO> getRecentActivity(String userId) {
        List<ActivityDTO> recentActivity = new ArrayList<>();

        // 예약
        recentActivity.addAll(getReservationList(userId));

        // 게시글
        recentActivity.addAll(getBoardList(userId));

        // 공지
        recentActivity.addAll(getNotificationList(userId));

        // 업무
        recentActivity.addAll(getTaskList(userId));

        // 결재 문서
        recentActivity.addAll(getPendingApprovalList(userId));
        recentActivity.addAll(getAssignedApprovalList(userId));

        // 일정
        recentActivity.addAll(getCalendarList(userId));

        // 모든 활동을 날짜 기준으로 정렬 후 최근 3개만 반환
        return recentActivity.stream()
                .sorted(Comparator.comparing(ActivityDTO::getCreatedAt).reversed())
                .limit(3)
                .toList();
    }

    // --- 예약 ---
    public List<ActivityDTO> getReservationList(String userId) {
        return reservationService.getMyReservations(userId)
                .stream()
                .limit(3)
                .map(item -> ActivityDTO.builder()
                        .type("reservation")
                        .createdAt(Timestamp.valueOf(item.getReservatedAt()))
                        .rawData(item)
                        .build())
                .toList();
    }

    // --- 게시글 ---
    public List<ActivityDTO> getBoardList(String userId) {
        List<BoardGroupDTO> groupList = boardGroupService.getGroupList(userId);

        List<BoardDTO> boardList = new ArrayList<>(boardService.getList(1, 1, 0, null)
                .stream().limit(3).toList()); // 공개 게시글

        for (BoardGroupDTO group : groupList) {
            boardList.addAll(boardService.getList(1, group.getId(), 0, null)
                    .stream().limit(3).toList());
        }

        return boardList.stream()
                .map(item -> ActivityDTO.builder()
                        .type("board")
                        .createdAt(item.getCreatedAt())
                        .rawData(item)
                        .build())
                .toList();
    }

    // --- 공지 ---
    public List<ActivityDTO> getNotificationList(String userId) {
        List<BoardGroupDTO> groupList = boardGroupService.getGroupList(userId);
        List<BoardDTO> notificationList = new ArrayList<>();

        for (BoardGroupDTO group : groupList) {
            notificationList.addAll(boardService.getNotificationList(group.getId())
                    .stream().limit(3).toList());
        }

        return notificationList.stream()
                .map(item -> ActivityDTO.builder()
                        .type("notification")
                        .createdAt(item.getCreatedAt())
                        .rawData(item)
                        .build())
                .toList();
    }

    // --- 업무 ---
    public List<ActivityDTO> getTaskList(String userId) {
        List<ProjectDTO> projectList = taskProjectService.getMyProjects(userId);
        List<TaskDTO> taskList = new ArrayList<>();

        for (ProjectDTO project : projectList) {
            taskList.addAll(taskProjectService.getTaskByProjectId(project.getId())
                    .stream().limit(3).toList());
        }

        return taskList.stream()
                .map(item -> ActivityDTO.builder()
                        .type("task")
                        .createdAt(Timestamp.valueOf(item.getCreatedAt()))
                        .rawData(item)
                        .build())
                .toList();
    }

    // --- 결재 문서 ---
    public List<ActivityDTO> getPendingApprovalList(String userId) {
        return approvalService.getList(userId, 1, 0, 0, null)
                .stream().limit(3)
                .map(item -> ActivityDTO.builder()
                        .type("pendingApproval")
                        .createdAt(item.getCreatedAt())
                        .rawData(item)
                        .build())
                .toList();
    }

    public List<ActivityDTO> getAssignedApprovalList(String userId) {
        return approvalService.getList(userId, 1, 3, 0, null)
                .stream().limit(3)
                .map(item -> ActivityDTO.builder()
                        .type("assignedApproval")
                        .createdAt(item.getCreatedAt())
                        .rawData(item)
                        .build())
                .toList();
    }

    // --- 일정 ---
    public List<ActivityDTO> getCalendarList(String userId) {
        List<CalendarGroupDTO> calendarGroupList = calendarGroupService.getListByUserId(userId);

        List<CalendarDTO> calendarList = new ArrayList<>(calendarService.getListByUserId(userId)
                .stream().limit(3).toList());

        for (CalendarGroupDTO group : calendarGroupList) {
            calendarList.addAll(calendarService.getListByGroupId(group.getId())
                    .stream().limit(3).toList());
        }

        return calendarList.stream()
                .map(item -> ActivityDTO.builder()
                        .type("calendar")
                        .createdAt(item.getCreatedAt())
                        .rawData(item)
                        .build())
                .toList();
    }

    // endregion
}
