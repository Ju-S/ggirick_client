package com.kedu.ggirick_client_backend.controllers.approval;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalDTO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalLineDTO;
import com.kedu.ggirick_client_backend.services.approval.ApprovalLineService;
import com.kedu.ggirick_client_backend.services.approval.ApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/approval")
@RequiredArgsConstructor
public class ApprovalController {
    private final ApprovalService approvalService;
    private final ApprovalLineService approvalLineService;

    // 결재 목록 조회
    // 사용자가 상신한 결재문서, 승인했던 결재문서, 반려했던 결재문서, 승인했지만 위에서 반려당한 결재문서, 결재해야할 문서를 조회
    @GetMapping
    public ResponseEntity<List<ApprovalDTO>> getList(@AuthenticationPrincipal UserTokenDTO userInfo) {
        return ResponseEntity.ok(approvalService.getList(userInfo.getId()));
    }

    // 결재 문서 작성
    // 결재선 insert, 첨부파일 업로드 까지 같이
    @PostMapping
    public ResponseEntity<Void> insert(@RequestPart("approvalInfo") ApprovalDTO approvalInfo,
                                       @RequestPart("approvalLine") List<ApprovalLineDTO> approvalLineInfoList,
                                       @RequestPart(value = "files", required = false) List<MultipartFile> files,
                                       @AuthenticationPrincipal UserTokenDTO userInfo) throws Exception {
        approvalInfo.setWriter(userInfo.getId());
        approvalService.insert(approvalInfo, files);
        approvalLineService.insert(approvalLineInfoList);
        return ResponseEntity.ok().build();
    }

    // 결재 문서 수정
    // 문서의 assigned_at이 null일 경우(진행중인 문서)에만 삭제진행
    @PutMapping("/{approvalId}")
    public ResponseEntity<Void> update(@RequestPart("approvalInfo") ApprovalDTO approvalInfo,
                                       @RequestPart(value = "approvalLine", required = false) List<ApprovalLineDTO> approvalLineInfoList,
                                       @RequestPart(value = "files", required = false) List<MultipartFile> files,
                                       @PathVariable int approvalId,
                                       @AuthenticationPrincipal UserTokenDTO userInfo) throws Exception {
        ApprovalDTO selectedApproval = approvalService.getById(approvalId);

        if (selectedApproval.getWriter().equals(userInfo.getId())
                && selectedApproval.getTypeId() == 3) {
            approvalInfo.setId(approvalId);
            approvalService.update(approvalInfo, files);
            approvalLineService.deleteByApprovalId(approvalId);
            approvalLineService.insert(approvalLineInfoList);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }


    // 결재 문서 삭제
    // 문서의 assigned_at이 null일 경우(진행중인 문서)에만 삭제진행
    @DeleteMapping("/{approvalId}")
    public ResponseEntity<Void> delete(@PathVariable int approvalId,
                                       @AuthenticationPrincipal UserTokenDTO userInfo) {
        ApprovalDTO selectedApproval = approvalService.getById(approvalId);

        if (selectedApproval.getWriter().equals(userInfo.getId())
                && selectedApproval.getTypeId() == 3) {
            approvalService.delete(approvalId);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @ExceptionHandler
    public ResponseEntity<Void> error(Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
