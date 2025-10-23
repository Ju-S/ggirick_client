package com.kedu.ggirick_client_backend.services.approval;

import com.kedu.ggirick_client_backend.dao.approval.ApprovalLineDAO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalLineDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ApprovalLineService {
    private final ApprovalLineDAO approvalLineDAO;

    // 결재선 조회
    public List<ApprovalLineDTO> getList(int approvalId) {
        return approvalLineDAO.getList(approvalId);
    }

    // 결재선 insert
    public void insert(List<ApprovalLineDTO> approvalLineList, int approvalId) {
        for (ApprovalLineDTO approvalLine : approvalLineList) {
            approvalLine.setApprovalId(approvalId);
            approvalLineDAO.insert(approvalLine);
        }
    }

    // 결재선 삭제(approvalId에 따라)
    public void deleteByApprovalId(int approvalId) {
        approvalLineDAO.deleteByApprovalId(approvalId);
    }

    // next_assigner와 approvalId를 가지는 결재선 조회
    public List<ApprovalLineDTO> getByNextAssignerAndApprovalId(String userId, int approvalId) {
        Map<String, Object> params = new HashMap<>();

        params.put("userId", userId);
        params.put("approvalId", approvalId);

        return approvalLineDAO.getByNextAssignerAndApprovalId(params);
    }

    // assigner와 approvalId를 가지는 결재선 조회
    public List<ApprovalLineDTO> getByAssignerAndApprovalId(String userId, int approvalId) {
        Map<String, Object> params = new HashMap<>();

        params.put("userId", userId);
        params.put("approvalId", approvalId);

        return approvalLineDAO.getByAssignerAndApprovalId(params);
    }
}
