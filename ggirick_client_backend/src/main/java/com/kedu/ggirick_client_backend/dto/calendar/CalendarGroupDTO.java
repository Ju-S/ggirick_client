package com.kedu.ggirick_client_backend.dto.calendar;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarGroupDTO {
    private int id;
    private String name;
    private String description;
    private String owner;
    private Timestamp createdAt;
}
