package com.kedu.ggirick_client_backend.services.approval;

import com.kedu.ggirick_client_backend.dao.approval.ApprovalDelegateDAO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApprovalDelegateService {
    private final ApprovalDelegateDAO approvalDelegateDAO;

    public List<String> getAssignerByDelegator(String userId) {
        return approvalDelegateDAO.getAssignerByDelegator(userId);
    }
}
