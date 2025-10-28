package com.kedu.ggirick_client_backend.controllers.approval;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalDTO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalFilesDTO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalHistoryDTO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalLineDTO;
import com.kedu.ggirick_client_backend.services.approval.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.kedu.ggirick_client_backend.config.ApprovalConfig.ITEM_PER_PAGE;
import static com.kedu.ggirick_client_backend.config.ApprovalConfig.PAGE_PER_NAV;

@RestController
@RequestMapping("/approval")
@RequiredArgsConstructor
public class ApprovalController {
    private final ApprovalService approvalService;
    private final ApprovalLineService approvalLineService;
    private final ApprovalFilesService approvalFilesService;
    private final ApprovalHistoryService approvalHistoryService;
    private final ApprovalProcessService approvalProcessService;
    private final ApprovalDelegateService approvalDelegateService;

    // 결재 목록 조회
    // 사용자가 상신한 결재문서, 승인했던 결재문서, 반려했던 결재문서, 승인했지만 위에서 반려당한 결재문서, 결재해야할 문서를 조회
    @GetMapping
    public ResponseEntity<Map<String, Object>> getList(@RequestParam(defaultValue = "1") int currentPage,
                                                       @RequestParam(defaultValue = "0") int box,
                                                       @RequestParam(defaultValue = "0") int searchFilter,
                                                       @RequestParam(defaultValue = "", required = false) String searchQuery,
                                                       @AuthenticationPrincipal UserTokenDTO userInfo) {
        Map<String, Object> response = new HashMap<>();
        // box = 0(전체), 1(대기), 2(승인), 3(반려) 보관함 선택
        List<ApprovalDTO> approvalList = approvalService.getList(userInfo.getId(), currentPage, box, searchFilter, searchQuery);
        int totalPage = approvalService.getTotalPage(userInfo.getId(), box, searchFilter, searchQuery);

        // 마지막 결재자 추가
        approvalList = approvalList.stream()
                .peek(e -> {
                    List<ApprovalHistoryDTO> history = approvalHistoryService.getListByApprovalId(e.getId());
                    if (!history.isEmpty()) {
                        e.setLastAssigner(history.get(history.size() - 1).getAssigner());
                    }
                })
                .toList();

        response.put("approvalList", approvalList);
        response.put("itemPerPage", ITEM_PER_PAGE);
        response.put("pagePerNav", PAGE_PER_NAV);
        response.put("totalPage", totalPage);

        return ResponseEntity.ok(response);
    }

    // 결재 문서 상세 조회
    @GetMapping("/{approvalId}")
    public ResponseEntity<Map<String, Object>> getItem(@PathVariable int approvalId,
                                                       @AuthenticationPrincipal UserTokenDTO userInfo) {
        // 관계자임을 증명해야 조회 가능
        List<ApprovalLineDTO> existedLineList = approvalLineService.getList(approvalId);
        // 대리결재할 수 있는 ID 리스트
        List<String> delegateOriginList = approvalDelegateService.getAssignerByDelegator(userInfo.getId());

        boolean authorityFlag = false;

        for (ApprovalLineDTO existedLine : existedLineList) {
            if (existedLine.getAssigner().equals(userInfo.getId()) || delegateOriginList.contains(existedLine.getAssigner())) {
                authorityFlag = true;
                break;
            }
        }

        if (approvalService.getById(approvalId).getWriter().equals(userInfo.getId()) || authorityFlag) {
            Map<String, Object> response = new HashMap<>();

            ApprovalDTO approvalInfo = approvalService.getById(approvalId);
            List<ApprovalFilesDTO> approvalFilesList = approvalFilesService.getListByApprovalId(approvalId);
            List<ApprovalHistoryDTO> approvalHistoryList = approvalHistoryService.getListByApprovalId(approvalId);
            List<ApprovalLineDTO> approvalLineList = approvalLineService.getList(approvalId);

            response.put("approvalDetail", approvalInfo);
            response.put("approvalFilesList", approvalFilesList);
            response.put("approvalHistoryList", approvalHistoryList);
            response.put("approvalLineList", approvalLineList);
            response.put("delegateOriginList", delegateOriginList);

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // 결재 문서 작성
    // 결재선 insert, 첨부파일 업로드 까지 같이
    @PostMapping
    public ResponseEntity<Void> insert(@RequestPart("approvalInfo") ApprovalDTO approvalInfo,
                                       @RequestPart("approvalLine") List<ApprovalLineDTO> approvalLineInfoList,
                                       @RequestPart(value = "files", required = false) List<MultipartFile> files,
                                       @AuthenticationPrincipal UserTokenDTO userInfo) throws Exception {
        approvalInfo.setWriter(userInfo.getId());
        approvalProcessService.processInsertApproval(approvalInfo, files, approvalLineInfoList);
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
        approvalProcessService.processUpdateApproval(approvalInfo, files, approvalLineInfoList, approvalId, userInfo.getId());
        return ResponseEntity.ok().build();
    }

    // 결재 문서 삭제
    // 문서의 assigned_at이 null일 경우(진행중인 문서)에만 삭제진행
    @DeleteMapping("/{approvalId}")
    public ResponseEntity<Void> delete(@PathVariable int approvalId,
                                       @AuthenticationPrincipal UserTokenDTO userInfo) {
        ApprovalDTO selectedApproval = approvalService.getById(approvalId);

        if (selectedApproval.getWriter().equals(userInfo.getId())
                && selectedApproval.getAssignedAt() == null) {
            approvalService.delete(approvalId);
            approvalFilesService.deleteByApprovalId(approvalId);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @ExceptionHandler
    public ResponseEntity<Void> error(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
