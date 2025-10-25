package com.kedu.ggirick_client_backend.dto.chat;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDTO {
    private String id;
    private Long workspaceId;
    private Long channelId;
    private String senderId;
    private String senderName;
    private String type; // user / system
    private String parentId;
    private String content; // BlockNote JSON
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", timezone = "Asia/Seoul")
    private Timestamp createdAt;

     //(이모지 반응용)
    private String emoji;
    // getter/setter
}
