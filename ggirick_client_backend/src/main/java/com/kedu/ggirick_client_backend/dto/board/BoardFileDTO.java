package com.kedu.ggirick_client_backend.dto.board;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BoardFileDTO {
    private int id;
    private String name; // 파일 원본 이름
    private String url; // 파일 시스템 저장 이름
    private int boardId;
}
