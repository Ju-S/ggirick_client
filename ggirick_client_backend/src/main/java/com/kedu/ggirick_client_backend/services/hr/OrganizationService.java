package com.kedu.ggirick_client_backend.services.hr;

import com.kedu.ggirick_client_backend.dao.common.OrganizationDAO;
import com.kedu.ggirick_client_backend.dto.common.OrganizationDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationDAO organizationDAO;

    // 조직 목록 조회 ( 메타 데이터 조회용 )
    public List<OrganizationDTO> getAllOrganizations() {
        return organizationDAO.getAllOrganizations();
    }
}
