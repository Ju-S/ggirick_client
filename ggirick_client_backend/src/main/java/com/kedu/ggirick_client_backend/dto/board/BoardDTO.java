package com.kedu.ggirick_client_backend.dto.board;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardDTO {
    private int id;
    private String writer;
    private String name;
    private String title;
    private String contents;
    private int boardGroupId;
    private Timestamp createdAt;
    private int viewCount;
}
