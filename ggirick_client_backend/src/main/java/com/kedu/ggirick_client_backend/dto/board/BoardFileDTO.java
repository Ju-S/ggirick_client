package com.kedu.ggirick_client_backend.dto.board;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardFileDTO {
    private int id;
    private String name;
    private String url;
    private int boardId;
}
