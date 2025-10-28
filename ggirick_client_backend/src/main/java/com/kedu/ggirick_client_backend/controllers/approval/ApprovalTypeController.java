package com.kedu.ggirick_client_backend.controllers.approval;

import com.kedu.ggirick_client_backend.dto.approval.ApprovalTypeDTO;
import com.kedu.ggirick_client_backend.services.approval.ApprovalTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/approval/type")
@RequiredArgsConstructor
public class ApprovalTypeController {
    private final ApprovalTypeService approvalTypeService;

    @GetMapping
    public ResponseEntity<List<ApprovalTypeDTO>> getTypeList() {
        return ResponseEntity.ok(approvalTypeService.getTypeList());
    }
}
