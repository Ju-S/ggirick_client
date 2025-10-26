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
public class ChatFileDTO {
    private Long id;
    private String messageId;
    private String filename;
    private String fileUrl;
    private Long fileSize;
    private Long channelId;
    private Long workspaceId;
    private Timestamp createdAt;

    // getter/setter
}
