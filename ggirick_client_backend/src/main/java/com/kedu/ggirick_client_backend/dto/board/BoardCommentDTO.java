package com.kedu.ggirick_client_backend.dto.board;

import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardCommentDTO {
    private int id;
    private String writer;
    private String name;
    private String contents;
    private Integer refCommentId;
    private int boardId;
    private Timestamp createdAt;
}
