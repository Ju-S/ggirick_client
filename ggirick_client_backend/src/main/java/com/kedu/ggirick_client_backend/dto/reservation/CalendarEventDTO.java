package com.kedu.ggirick_client_backend.dto.reservation;

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
public class CalendarEventDTO {
    private Long id;
    private String title;
    private LocalDateTime start;
    private  LocalDateTime end;
    private Long resourceId;

    private  LocalDateTime reservatedAt;
    private String status;
    private String purpose;
    private String description;
    private String resourceName;
    private String employeeName;
}
