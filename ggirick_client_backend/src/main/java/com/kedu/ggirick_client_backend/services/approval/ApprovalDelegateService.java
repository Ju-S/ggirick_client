package com.kedu.ggirick_client_backend.services.approval;

import com.kedu.ggirick_client_backend.dao.approval.ApprovalDelegateDAO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalDelegateDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApprovalDelegateService {
    private final ApprovalDelegateDAO approvalDelegateDAO;

    // 대리결재자 등록
    public void insertDelegator(ApprovalDelegateDTO delegateInfo) {
        approvalDelegateDAO.insert(delegateInfo);
    }

    public List<String> getAssignerByDelegator(String userId) {
        return approvalDelegateDAO.getAssignerByDelegator(userId);
    }
}
