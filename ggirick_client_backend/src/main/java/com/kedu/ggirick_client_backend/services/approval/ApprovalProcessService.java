package com.kedu.ggirick_client_backend.services.approval;

import com.google.gson.Gson;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalDTO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalDelegateDTO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalHistoryDTO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalLineDTO;
import com.kedu.ggirick_client_backend.utils.approval.DocDataUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static com.kedu.ggirick_client_backend.config.ApprovalConfig.*;

@Service
@RequiredArgsConstructor
public class ApprovalProcessService {
    private final ApprovalHistoryService approvalHistoryService;
    private final ApprovalLineService approvalLineService;
    private final ApprovalService approvalService;
    private final ApprovalFilesService approvalFilesService;
    private final ApprovalDelegateService approvalDelegateService;

    private final DocDataUtil docDataUtil;

    // 결재 상태 변경 로직
    @Transactional
    public void processApproval(ApprovalHistoryDTO approvalHistoryInfo, String userId) throws Exception {
        // 사용자 아이디 및 대리결재 해야할 다른사람 id 포함
        List<String> assignerList = approvalDelegateService.getAssignerByDelegator(userId);
        assignerList.add(userId);

        List<ApprovalLineDTO> approvalLineList = new ArrayList<>();
        for (String id : assignerList) {
            for (ApprovalLineDTO approvalLine : approvalLineService.getByAssignerAndApprovalId(id, approvalHistoryInfo.getApprovalId())) {
                approvalLine.setAssigner(id);
                approvalLineList.add(approvalLine);
            }
        }

        // 사용자에 대한 결재선이 없거나 문서가 이미 승인또는반려된 경우 throws
        if (approvalLineList.isEmpty() || approvalService.getById(approvalHistoryInfo.getApprovalId()).getAssignedAt() != null) {
            throw new Exception();
        }

        // 조회된 approval_line의 assigner와 approvalId에 해당하는 approval_history를 조회
        // 조회된 내용이 있거나 approval_line의 assigner가 null인 경우, 결재 상태 변경
        // 단, 조회된 내용의 type_id가 CANCLE(취소)상태라면 결재 상태 변경을 허용하지 않는다
        for (ApprovalLineDTO approvalLine : approvalLineList) {
            ApprovalHistoryDTO prevHistory = approvalHistoryService.getPrevHistory(approvalLine.getOrderLine(), approvalHistoryInfo.getApprovalId());
            if (approvalLine.getOrderLine() == 0 ||
                    (prevHistory != null && prevHistory.getTypeId() != TYPE_CANCEL && prevHistory.getTypeId() != TYPE_COMMENT)) {
                // 대리결재인 경우 컬럼 Y로
                approvalHistoryInfo.setAssigner(approvalLine.getAssigner());
                approvalHistoryInfo.setIsDelegated(approvalLine.getAssigner().equals(userId) ? "N" : "Y");
                approvalHistoryService.insert(approvalHistoryInfo);

                // 결재 상태 변경이 반려인 경우, 결재문서의 상태를 반려로 변경
                if (approvalHistoryInfo.getTypeId() == TYPE_REJECT) {
                    approvalService.updateType(TYPE_REJECT, approvalHistoryInfo.getApprovalId());
                }

                // 결재 상태 변경이 의견 또는 취소가 아닌 경우, 결재문서의 상태를 승인로 변경
                if (approvalHistoryInfo.getTypeId() == TYPE_APPROVE &&
                        approvalLineService.getLastOrderLine(approvalHistoryInfo.getApprovalId()) == approvalLine.getOrderLine()) {
                    approvalService.updateType(TYPE_APPROVE, approvalHistoryInfo.getApprovalId());

                    // 문서 승인 후, 문서 종류에 따라 다른 로직 수행
                    // 대리결재자가 필요한 경우, 대리결재자 등록 service 사용 필요
                    // TODO: 문서 종류에 대한 처리 - config/ApprovalConfig에 정의
                    switch (approvalService.getById(approvalHistoryInfo.getApprovalId()).getDocTypeCode()) {
                        case DOC_TYPE_CONTACT -> {
                            break;
                        }
                        case DOC_TYPE_VACATION -> {
                            break;
                        }
                        case DOC_TYPE_HOLIDAY -> {
                            break;
                        }
                        case DOC_TYPE_OVERTIME -> {
                            break;
                        }
                        case DOC_TYPE_WORK_CHECK -> {
                            break;
                        }
                    }
                }
                return;
            }
            throw new Exception();
        }
    }

    // 결재 문서 생성
    @Transactional
    public void processInsertApproval(ApprovalDTO approvalInfo, List<MultipartFile> files, List<ApprovalLineDTO> approvalLineInfoList) throws Exception {
        Gson gson = new Gson();
        approvalInfo.setDocDataJson(gson.toJson(approvalInfo.getDocData()));

        int approvalId = approvalService.insert(approvalInfo);
        // 휴가신청일 경우, 대리결재자 등록
        if (approvalInfo.getDocTypeCode().equals(DOC_TYPE_VACATION) && approvalInfo.getDocData().get("delegatorList") != null) {
            for (Map<String, Object> delegator : (List<Map<String, Object>>) approvalInfo.getDocData().get("delegatorList")) {
                approvalDelegateService.insertDelegator(
                        ApprovalDelegateDTO.builder()
                                .assigner((String) delegator.get("id"))
                                .delegater(approvalInfo.getWriter())
                                .start_at(docDataUtil.convertToTimestamp(approvalInfo.getDocData(), true))
                                .end_at(docDataUtil.convertToTimestamp(approvalInfo.getDocData(), false))
                                .build());
            }
        }
        if (files != null) {
            approvalFilesService.insertFileInfo(files, approvalId);
        }
        approvalLineService.insert(approvalLineInfoList, approvalId);
    }

    // 결재 문서 수정
    @Transactional
    public void processUpdateApproval(ApprovalDTO
                                              approvalInfo, List<MultipartFile> files, List<ApprovalLineDTO> approvalLineInfoList, int approvalId, String
                                              userId) throws Exception {
        ApprovalDTO selectedApproval = approvalService.getById(approvalId);

        if (selectedApproval.getWriter().equals(userId)
                && selectedApproval.getAssignedAt() == null) {
            approvalInfo.setId(approvalId);
            approvalService.update(approvalInfo);
            if (files != null) {
                approvalFilesService.insertFileInfo(files, approvalId);
            }
            if (approvalLineInfoList != null) {
                approvalLineService.deleteByApprovalId(approvalId);
                approvalLineService.insert(approvalLineInfoList, approvalId);
            }
        }
    }
}
