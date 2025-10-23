package com.kedu.ggirick_client_backend.services.approval;

import com.kedu.ggirick_client_backend.dao.approval.ApprovalLineDAO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalLineDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApprovalLineService {
    private final ApprovalLineDAO approvalLineDAO;

    // 결재선 조회
    public List<ApprovalLineDTO> getList(int approvalId) {
        return approvalLineDAO.getList(approvalId);
    }

    // 결재선 insert
    public void insert(List<ApprovalLineDTO> approvalLineList) {
        for(ApprovalLineDTO approvalLine : approvalLineList) {
            approvalLineDAO.insert(approvalLine);
        }
    }

    // 결재선 삭제(approvalId에 따라)
    public void deleteByApprovalId(int approvalId) {
        approvalLineDAO.deleteByApprovalId(approvalId);
    }
}
