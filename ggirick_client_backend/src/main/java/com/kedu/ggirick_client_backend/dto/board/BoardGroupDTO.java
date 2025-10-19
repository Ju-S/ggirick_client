package com.kedu.ggirick_client_backend.dto.board;

import lombok.*;

import java.sql.Timestamp;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardGroupDTO {
    private int id;
    private String name;
    private String description;
    private String ownerId;
    private Timestamp createdAt;
}
