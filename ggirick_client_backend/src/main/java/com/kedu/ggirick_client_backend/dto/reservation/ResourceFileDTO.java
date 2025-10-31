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
public class ResourceFileDTO {
    private Long id;
    private String fileUrl;
    private Long reservationResourceId;
    private String filename;
    private String sysname;
    private LocalDateTime createdAt;
}