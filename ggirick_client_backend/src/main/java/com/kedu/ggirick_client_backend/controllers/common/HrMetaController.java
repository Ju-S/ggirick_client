package com.kedu.ggirick_client_backend.controllers.common;

import com.kedu.ggirick_client_backend.dto.common.AuthorityDTO;
import com.kedu.ggirick_client_backend.dto.common.DepartmentDTO;
import com.kedu.ggirick_client_backend.dto.common.JobDTO;
import com.kedu.ggirick_client_backend.dto.common.OrganizationDTO;
import com.kedu.ggirick_client_backend.dto.employee.OrganizationWithDepartmentsDTO;
import com.kedu.ggirick_client_backend.services.hr.AuthorityService;
import com.kedu.ggirick_client_backend.services.hr.DepartmentService;
import com.kedu.ggirick_client_backend.services.hr.JobService;
import com.kedu.ggirick_client_backend.services.hr.OrganizationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/hr-meta")
@RequiredArgsConstructor
public class HrMetaController {

    private final DepartmentService departmentService;
    private final JobService jobService;
    private final OrganizationService organizationService;
    private final AuthorityService authorityService;

    @GetMapping("/departments")
    public List<DepartmentDTO> getDepartments() {
        return departmentService.getAllDepartments();
    }

    @GetMapping("/jobs")
    public List<JobDTO> getJobs() {
        return jobService.getAllJobs();
    }

    @GetMapping("/organizations")
    public List<OrganizationDTO> getOrganizations() {
        return organizationService.getAllOrganizations();
    }

    @GetMapping("/authorities")
    public List<AuthorityDTO> getAuthorities() {
        return authorityService.getAllAuthorities();
    }

    @GetMapping("/org-structure")
    public ResponseEntity<List<OrganizationWithDepartmentsDTO>> getOrgStructure() {
        return ResponseEntity.ok( organizationService.getOrgStructure());
    }
}
