package com.kedu.ggirick_client_backend.dto.dashboard;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityDTO {
    private String type; // reservation, board, task, approval, calendar...
    private Timestamp createdAt;
    private Object rawData; // 원본 DTO
}