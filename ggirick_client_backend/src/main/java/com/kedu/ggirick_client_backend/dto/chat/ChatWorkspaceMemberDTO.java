package com.kedu.ggirick_client_backend.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatWorkspaceMemberDTO {
    private Long id;             // PK
    private Long workspaceId;    // 워크스페이스 ID (FK)
    private String employeeId;
    private String name; //사용자 이름 (join해서 가져오기)
    private String profileUrl; //사용자 프로필 (join해서 가져오기)
    private Long roleId;         // 권한
    private Timestamp joinedAt;
}