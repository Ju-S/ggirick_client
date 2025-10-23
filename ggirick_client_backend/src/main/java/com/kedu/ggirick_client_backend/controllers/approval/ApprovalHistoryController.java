package com.kedu.ggirick_client_backend.controllers.approval;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalHistoryDTO;
import com.kedu.ggirick_client_backend.services.approval.ApprovalHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/approval/{approvalId}/history")
@RequiredArgsConstructor
public class ApprovalHistoryController {
    private final ApprovalHistoryService approvalHistoryService;

    // 결재 상태 변경
    @PostMapping
    public ResponseEntity<Void> insert(@RequestBody ApprovalHistoryDTO approvalHistoryInfo,
                                       @PathVariable int approvalId,
                                       @AuthenticationPrincipal UserTokenDTO userInfo) {

        return ResponseEntity.ok().build();
    }
}
