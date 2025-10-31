package com.kedu.ggirick_client_backend.services.approval;

import com.google.gson.Gson;
import com.kedu.ggirick_client_backend.dao.approval.ApprovalDAO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.kedu.ggirick_client_backend.config.ApprovalConfig.ITEM_PER_PAGE;

@Service
@RequiredArgsConstructor
public class ApprovalService {
    private final ApprovalDAO approvalDAO;

    // 결재 문서 목록 조회
    // 사용자가 상신한 결재문서, 승인했던 결재문서, 반려했던 결재문서, 승인했지만 위에서 반려당한 결재문서, 결재해야할 문서를 조회
    public List<ApprovalDTO> getList(String userId, int currentPage, int box, int searchFilter, String searchQuery) {
        Map<String, Object> params = new HashMap<>();

        int from = ITEM_PER_PAGE * (currentPage - 1) + 1;
        int to = from + ITEM_PER_PAGE - 1;

        params.put("from", from);
        params.put("to", to);

        params.put("userId", userId);
        params.put("box", box);
        params.put("searchFilter", searchFilter);
        params.put("searchQuery", searchQuery);

        return approvalDAO.getList(params);
    }

    // 문서 총 페이지 수 조회
    public int getTotalPage(String userId, int box, int searchFilter, String searchQuery) {
        Map<String, Object> params = new HashMap<>();

        params.put("userId", userId);
        params.put("box", box);
        params.put("searchFilter", searchFilter);
        params.put("searchQuery", searchQuery);

        return approvalDAO.getTotalPage(params) / ITEM_PER_PAGE + 1;
    }

    // 개별 문서 조회
    public ApprovalDTO getById(int approvalId) {
        ApprovalDTO approval =  approvalDAO.getById(approvalId);
        Gson gson = new Gson();
        approval.setDocData(gson.fromJson(approval.getDocDataJson(), Map.class));
        return approval;
    }

    // 결재 문서 기안
    // 파일 업로드 포함
    public int insert(ApprovalDTO approvalInfo) throws Exception {
        return approvalDAO.insert(approvalInfo);
    }

    // 결재 문서 수정
    public void update(ApprovalDTO approvalInfo) throws Exception {
        approvalDAO.update(approvalInfo);
    }

    // 결재 문서 상태 수정
    public void updateType(int typeId, int approvalId) {
        Map<String, Object> params = new HashMap<>();

        params.put("typeId", typeId);
        params.put("id", approvalId);

        approvalDAO.updateType(params);
    }

    // 결재 문서 삭제
    public void delete(int approvalId) {
        approvalDAO.delete(approvalId);
    }

     // 특정 직원의 승인 완료된 문서를 유형별로 조회 (VAC, OWR, HWR 등)
     public List<ApprovalDTO> getApprovedDocsByEmployeeAndType(String employeeId, String docTypeCode) {
         Map<String, Object> params = new HashMap<>();
         params.put("employeeId", employeeId);
         params.put("docTypeCode", docTypeCode);
         return approvalDAO.getApprovedDocsByEmployeeAndType(params);
     }
}
