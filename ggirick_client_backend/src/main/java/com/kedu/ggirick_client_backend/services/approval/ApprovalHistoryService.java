package com.kedu.ggirick_client_backend.services.approval;

import com.kedu.ggirick_client_backend.dao.approval.ApprovalHistoryDAO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalHistoryDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ApprovalHistoryService {
    private final ApprovalHistoryDAO approvalHistoryDAO;

    // 결재 기록 insert
    public void insert(ApprovalHistoryDTO approvalHistoryInfo) throws Exception {
        approvalHistoryDAO.insert(approvalHistoryInfo);
    }

    // 결재 기록 목록 조회
    public List<ApprovalHistoryDTO> getListByApprovalId(int approvalId) {
        return approvalHistoryDAO.getListByApprovalId(approvalId);
    }

    // 결재 기록 조회
    public ApprovalHistoryDTO getByAssignerAndApprovalId(String userId, int approvalId) {
        Map<String, Object> params = new HashMap<>();

        params.put("userId", userId);
        params.put("approvalId", approvalId);

        return approvalHistoryDAO.getByAssignerAndApprovalId(params);
    }

    // 사용자 이전 결재 기록 조회
    public ApprovalHistoryDTO getPrevHistory(int orderLine, int approvalId) {
        Map<String, Object> params = new HashMap<>();

        params.put("userOrderLine", orderLine);
        params.put("approvalId", approvalId);

        return approvalHistoryDAO.getPrevHistory(params);
    }

    // 결재 기록 취소(삭제)
    public void deleteByApprovalIdAndAssigner(String userId, int approvalId) {
        Map<String, Object> params = new HashMap<>();

        params.put("userId", userId);
        params.put("approvalId", approvalId);

        approvalHistoryDAO.deleteByApprovalIdAndAssigner(params);
    }

    // 최근 3개 기록 조회
    public List<ApprovalHistoryDTO> getRecentHistory(String userId) {
        return approvalHistoryDAO.getRecentHistory(userId);
    }
}
