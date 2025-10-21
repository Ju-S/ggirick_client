package com.kedu.ggirick_client_backend.dto.task;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMemberDTO {
    private long id;
    private long projectId;
    private String employeeId;
    private long roleId;
    private String name;
    private String roleName;
}
