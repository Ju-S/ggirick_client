package com.kedu.ggirick_client_backend.controllers.approval;

import com.kedu.ggirick_client_backend.services.approval.ApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/approval")
@RequiredArgsConstructor
public class ApprovalController {
    private final ApprovalService approvalService;
}
