package com.kedu.ggirick_client_backend.dto.calendar;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CalendarDTO {
    private int id;
    private String title;
    private String description;
    private String color;
    private String recurrence;
    private Timestamp recurrenceEnd;
    private Integer groupId;
    private Timestamp createdAt;
    private String writer;
    private String name;
    private Timestamp startAt;
    private Timestamp endAt;
}
