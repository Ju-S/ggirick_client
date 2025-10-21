package com.kedu.ggirick_client_backend.dto.task;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CalenderTaskDTO {

    private Long id;
    private String title;
    private  LocalDateTime start; //started_at
    private  LocalDateTime end; //ended_at

    private Long projectId;
    private String assignee;
    private String assigner;
    private String status;
    private String priority;
    private String task_data; //json전체
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
