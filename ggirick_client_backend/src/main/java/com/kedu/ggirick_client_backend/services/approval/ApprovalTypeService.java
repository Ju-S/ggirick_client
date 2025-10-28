package com.kedu.ggirick_client_backend.services.approval;

import com.kedu.ggirick_client_backend.dao.approval.ApprovalTypeDAO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalTypeDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApprovalTypeService {
    private final ApprovalTypeDAO approvalTypeDAO;

    public List<ApprovalTypeDTO> getTypeList() {
        return approvalTypeDAO.getTypeList();
    }
}
