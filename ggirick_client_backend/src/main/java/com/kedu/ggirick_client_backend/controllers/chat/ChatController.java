package com.kedu.ggirick_client_backend.controllers.chat;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatDto;
import com.kedu.ggirick_client_backend.services.chat.ChatService;
import com.kedu.ggirick_client_backend.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;

    /**
     * 워크스페이스 내 특정 채널에 메시지를 보냄
     *
     * 예)
     *  클라이언트 -> SEND /app/workspace/1/channel/10
     *  서버 -> SUBSCRIBE /topic/workspace/1/channel/10
     */
    @MessageMapping("/workspace/{workspaceId}/channel/{channelId}")
    @SendTo("/topic/workspace/{workspaceId}/channel/{channelId}")
    public ChatDto messageHandler(
            @DestinationVariable Long workspaceId,
            @DestinationVariable Long channelId,
            ChatDto message,
            @AuthenticationPrincipal UserTokenDTO userInfo
    ) {
        String loginId = userInfo.getId();
        log.info("📩 [workspace={}, channel={}] {}: {}", workspaceId, channelId, loginId, message.getMessage());

        // 서비스 계층에서 DB 저장 및 메시지 생성
        return chatService.createChat(workspaceId, channelId, message.getMessage(), loginId);
    }
}