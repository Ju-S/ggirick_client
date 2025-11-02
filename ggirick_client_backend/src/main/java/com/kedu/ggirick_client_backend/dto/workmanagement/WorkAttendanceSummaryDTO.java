package com.kedu.ggirick_client_backend.dto.workmanagement;

import lombok.Data;

import java.sql.Date;

@Data
public class WorkAttendanceSummaryDTO {
    private int id;
    private String employeeId;
    private Date workDate;
    private String status;
    private double workHours;
    private Date createdAt;
    private Date updatedAt;
}

