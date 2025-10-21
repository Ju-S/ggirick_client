package com.kedu.ggirick_client_backend.services.hr;

import com.kedu.ggirick_client_backend.dao.common.OrganizationDAO;
import com.kedu.ggirick_client_backend.dto.common.OrganizationDTO;
import com.kedu.ggirick_client_backend.dto.employee.OrgEmployeeDTO;
import com.kedu.ggirick_client_backend.dto.employee.DepartmentWithEmployeesDTO;
import com.kedu.ggirick_client_backend.dto.employee.OrganizationWithDepartmentsDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationDAO organizationDAO;

    // 조직 목록 조회 ( 메타 데이터 조회용 )
    public List<OrganizationDTO> getAllOrganizations() {
        return organizationDAO.getAllOrganizations();
    }


    public List<OrganizationWithDepartmentsDTO> getOrgStructure() {
        return organizationDAO.findOrganizationStructure();
    }

}
