package com.kedu.ggirick_client_backend.controllers.approval;

import com.kedu.ggirick_client_backend.dto.approval.ApprovalFilesDTO;
import com.kedu.ggirick_client_backend.services.approval.ApprovalFilesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/approval/{approvalId}/files")
@RequiredArgsConstructor
public class ApprovalFilesController {
    private final ApprovalFilesService approvalFilesService;
}
