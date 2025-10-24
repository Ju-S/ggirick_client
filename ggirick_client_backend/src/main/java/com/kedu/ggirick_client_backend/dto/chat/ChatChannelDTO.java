package com.kedu.ggirick_client_backend.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatChannelDTO {
    private Long id;
    private Long workspaceId;
    private String name;
    private String type; // TEXT / VOICE 등
}