package com.kedu.ggirick_client_backend.dto.reservation;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDTO {
    private Long id;
    private String employeeId;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private Long resourceId;
    private LocalDateTime reservatedAt;
    private String status;
    private String purpose;
    private String resourceName;
    private String employeeName;

}
