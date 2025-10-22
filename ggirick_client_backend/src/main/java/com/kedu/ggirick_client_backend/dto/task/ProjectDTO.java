package com.kedu.ggirick_client_backend.dto.task;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {
    private long id;
    private String name;
    private String description;
    private String createdBy;
    private String createdByEmployeeName;
    private String range;
    private List<ProjectMemberDTO> members;
    private List<TaskDTO> tasks;

}