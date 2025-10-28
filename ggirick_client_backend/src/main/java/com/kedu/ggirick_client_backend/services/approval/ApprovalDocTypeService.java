package com.kedu.ggirick_client_backend.services.approval;

import com.kedu.ggirick_client_backend.dao.approval.ApprovalDocTypeDAO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalDocTypeDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApprovalDocTypeService {
    private final ApprovalDocTypeDAO approvalDocTypeDAO;

    public List<ApprovalDocTypeDTO> getDocTypeList() {
        return approvalDocTypeDAO.getDocTypeList();
    }
}
