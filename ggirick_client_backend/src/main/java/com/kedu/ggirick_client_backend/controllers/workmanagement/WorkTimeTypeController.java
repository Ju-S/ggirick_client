package com.kedu.ggirick_client_backend.controllers.workmanagement;

import com.kedu.ggirick_client_backend.dto.workmanagement.WorkTimeTypeDTO;
import com.kedu.ggirick_client_backend.services.workmanagement.WorkTimeTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/workmanagement/worktimetype")
public class WorkTimeTypeController {
    private final WorkTimeTypeService workTimeTypeService;

    @GetMapping
    // 근무현황 기록용 유형 목록 가져오기
    public ResponseEntity<List<WorkTimeTypeDTO>> getAllWorkTimeTypes() {
        return ResponseEntity.ok(workTimeTypeService.getAllWorkTimeTypes());
    }
}
