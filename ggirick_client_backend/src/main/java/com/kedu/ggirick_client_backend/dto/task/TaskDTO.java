package com.kedu.ggirick_client_backend.dto.task;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TaskDTO {
    private Long id;
    private Long projectId;
    private String title;
    private String assignee;
    private String assigner;
    private String status;
    private String priority;
    private LocalDate startedAt;
    private  LocalDate endedAt;
    private String taskData;     // JSON 전체
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;


}