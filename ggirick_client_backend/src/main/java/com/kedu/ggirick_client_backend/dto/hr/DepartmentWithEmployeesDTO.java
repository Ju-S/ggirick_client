package com.kedu.ggirick_client_backend.dto.hr;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentWithEmployeesDTO {
    private String code;
    private String name;
    private String uniqueId;
    private List<OrgEmployeeDTO> employees;
}
