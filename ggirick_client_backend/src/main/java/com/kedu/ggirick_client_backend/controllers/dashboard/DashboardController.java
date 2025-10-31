package com.kedu.ggirick_client_backend.controllers.dashboard;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.services.approval.ApprovalHistoryService;
import com.kedu.ggirick_client_backend.services.approval.ApprovalService;
import com.kedu.ggirick_client_backend.services.dashboard.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;
    private final ApprovalService approvalService;
    private final ApprovalHistoryService approvalHistoryService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardNews(@AuthenticationPrincipal UserTokenDTO userInfo) {
        Map<String, Object> news = new HashMap<>();

        // 읽지않은 메일 수


        // 오늘 일정(todayScheduleSize)
        // 다가오는 일정(3개)(upcomingScheduleList)
        news.putAll(dashboardService.getScheduleInfo(userInfo.getId()));

        // 대기중인 결재
        news.put("pendingApprovalCount", approvalService.getTotalDocs(userInfo.getId(), 1, 0, null));
        // 최근 결재 현황(3개)
        news.put("recentApprovalHistory", dashboardService.getRecentApprovalHistory(userInfo.getId()));


        // 최신 공지
        news.put("recentNotification", dashboardService.getRecentNotification(userInfo.getId()));

        // 최근 활동(3개)


        return ResponseEntity.ok(news);
    }
}
