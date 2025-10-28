package com.kedu.ggirick_client_backend.controllers.workmanagement;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.workmanagement.WorkSummaryDTO;
import com.kedu.ggirick_client_backend.dto.workmanagement.WorkSearchConditionDTO;
import com.kedu.ggirick_client_backend.dto.workmanagement.WorkTimeLogDTO;
import com.kedu.ggirick_client_backend.services.workmanagement.WorkTimeLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/worktimelog")
public class WorkTimeLogController {

    private final WorkTimeLogService workTimeLogService;

    // 근무기록 저장 - 저장 후 바로 저장된 데이터 반환
    @PostMapping
    public ResponseEntity<WorkTimeLogDTO> insert(@RequestBody WorkTimeLogDTO dto,
                                       @AuthenticationPrincipal UserTokenDTO userInfo) {
        dto.setEmployeeId(userInfo.getId());
        WorkTimeLogDTO saved = workTimeLogService.insert(dto);

        return ResponseEntity.ok(saved);
    }

    // 단일 근무기록 조회 (로그 id 기준)
    @GetMapping("/{id}")
    public ResponseEntity<WorkTimeLogDTO> getWorkTimeLogById(@PathVariable Long id) {
        WorkTimeLogDTO log = workTimeLogService.getWorkTimeLogById(id);
        return ResponseEntity.ok(log);
    }

    // 근무기록 수정
    @PutMapping
    public ResponseEntity<Void> update(@RequestBody WorkTimeLogDTO dto) {
        workTimeLogService.update(dto);
        return ResponseEntity.ok().build();
    }

    // 근무기록 삭제
    @DeleteMapping("/{logId}")
    public ResponseEntity<Void> delete(@PathVariable Long logId) {
        workTimeLogService.delete(logId);
        return ResponseEntity.ok().build();
    }

    // 오늘 내 근무 기록 전체 조회
    @GetMapping
    public ResponseEntity<List<WorkTimeLogDTO>> getWorkTimeLogsByEmployeeId(
            @AuthenticationPrincipal UserTokenDTO userInfo) {
        List<WorkTimeLogDTO> list = workTimeLogService.getWorkTimeLogsByEmployeeId(userInfo.getId());
        return ResponseEntity.ok(list);
    }

    // 로그 리스트 조건 조회용 - (기간 + 조직/부서)
    @PostMapping("/search")
    public ResponseEntity<List<WorkTimeLogDTO>> getWorkTimeLogsByCondition(
            @RequestBody WorkSearchConditionDTO condition,
            @AuthenticationPrincipal UserTokenDTO userInfo) {
        condition.setEmployeeId(userInfo.getId());
        return ResponseEntity.ok(workTimeLogService.getWorkTimeLogsByCondition(condition));
    }

    @ExceptionHandler
    public ResponseEntity<Void> error(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
