package com.kedu.ggirick_client_backend.services.dashboard;

import com.kedu.ggirick_client_backend.dto.approval.ApprovalDTO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalHistoryDTO;
import com.kedu.ggirick_client_backend.dto.board.BoardDTO;
import com.kedu.ggirick_client_backend.dto.board.BoardGroupDTO;
import com.kedu.ggirick_client_backend.dto.calendar.CalendarDTO;
import com.kedu.ggirick_client_backend.dto.calendar.CalendarGroupDTO;
import com.kedu.ggirick_client_backend.services.approval.ApprovalHistoryService;
import com.kedu.ggirick_client_backend.services.approval.ApprovalService;
import com.kedu.ggirick_client_backend.services.board.BoardGroupService;
import com.kedu.ggirick_client_backend.services.board.BoardService;
import com.kedu.ggirick_client_backend.services.calendar.CalendarGroupService;
import com.kedu.ggirick_client_backend.services.calendar.CalendarService;
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
            LocalDateTime recurrenceEnd = item.getRecurrenceEnd() != null
                    ? item.getRecurrenceEnd().toLocalDateTime()
                    : start.plusMonths(6); // 기본 6개월까지만 확장

            while (!start.isAfter(recurrenceEnd)) {
                // 오늘 포함 여부 비교 (날짜만 비교)
                if (!start.toLocalDate().isBefore(today)) {
                    expandedList.add(copySchedule(item, start));
                }

                if (item.getRecurrence().equalsIgnoreCase("none")) {
                    break;
                }

                start = switch (item.getRecurrence()) {
                    case "daily" -> start.plusDays(1);
                    case "weekly" -> start.plusWeeks(1);
                    case "monthly" -> start.plusMonths(1);
                    case "yearly" -> start.plusYears(1);
                    default -> start;
                };
            }
        }
        return expandedList;
    }

    // 일정 복사
    public CalendarDTO copySchedule(CalendarDTO original, LocalDateTime start) {
        return CalendarDTO.builder()
                .startAt(Timestamp.valueOf(start))
                .title(original.getTitle())
                .name(original.getName())
                .groupId(original.getGroupId())
                .build();
    }
    // endregion

    // region 게시글 관련
    // 최신 공지글 하나 조회
    public BoardDTO getRecentNotification(String userId) {
        List<BoardGroupDTO> boardGroupList = boardGroupService.getGroupList(userId);
        List<BoardDTO> notificationList = new ArrayList<>();

        for (BoardGroupDTO boardGroup : boardGroupList) {
            notificationList.addAll(boardService.getNotificationList(boardGroup.getId()));
        }

        notificationList.sort(Comparator.comparing(BoardDTO::getCreatedAt).reversed());
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
}
