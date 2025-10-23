package com.kedu.ggirick_client_backend.services.approval;

import com.kedu.ggirick_client_backend.dao.approval.ApprovalHistoryDAO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalHistoryDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApprovalHistoryService {
    private final ApprovalHistoryDAO approvalHistoryDAO;

    // 결재 기록 insert
    public void insert(ApprovalHistoryDTO approvalHistoryInfo) {
        approvalHistoryDAO.insert(approvalHistoryInfo);
    }

    // 결재 기록 조회
    public List<ApprovalHistoryDTO> getListByApprovalId(int approvalId) {
        return approvalHistoryDAO.getListByApprovalId(approvalId);
    }
}
