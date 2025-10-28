package com.kedu.ggirick_client_backend.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatChannelDTO {
    private Long id;
    private Long workspaceId;
    private String name;
    private int typeId;
    private String type;
    private String description;
    private LocalDateTime createdAt;
}