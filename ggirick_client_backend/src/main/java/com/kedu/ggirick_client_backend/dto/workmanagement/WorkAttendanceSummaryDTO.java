package com.kedu.ggirick_client_backend.dto.workmanagement;

import lombok.Builder;
import lombok.Data;

import java.sql.Date;

@Data
@Builder
public class WorkAttendanceSummaryDTO {
    private int id;
    private String employeeId;
    private Date workDate;
    private String status;
    private double workHours;
    private Date createdAt;
    private Date updatedAt;
}

