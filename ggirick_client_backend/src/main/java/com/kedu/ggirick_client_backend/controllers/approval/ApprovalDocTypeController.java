package com.kedu.ggirick_client_backend.controllers.approval;

import com.kedu.ggirick_client_backend.dto.approval.ApprovalDocTypeDTO;
import com.kedu.ggirick_client_backend.services.approval.ApprovalDocTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/approval/doctype")
@RequiredArgsConstructor
public class ApprovalDocTypeController {
    private final ApprovalDocTypeService approvalDocTypeService;

    @GetMapping
    public ResponseEntity<List<ApprovalDocTypeDTO>> getDocTypeList() {
        return ResponseEntity.ok(approvalDocTypeService.getDocTypeList());
    }
}
