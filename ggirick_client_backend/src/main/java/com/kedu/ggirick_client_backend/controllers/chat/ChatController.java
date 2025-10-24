package com.kedu.ggirick_client_backend.controllers.chat;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatMessageDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatMessageFromDBDTO;
import com.kedu.ggirick_client_backend.services.chat.ChatReactionService;
import com.kedu.ggirick_client_backend.services.chat.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final ChatReactionService chatReactionService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    /**
     * 워크스페이스 내 특정 채널에 메시지를 보냄
     *
     * 예)
     *  클라이언트 -> SEND /send/workspace/1/channel/10
     *  서버 -> SUBSCRIBE /subscribe/workspace/1/channel/10
     */
    @MessageMapping("/workspace/{workspaceId}/channel/{channelId}")
    public void sendMessage(@DestinationVariable Long workspaceId,
                            @DestinationVariable Long channelId,
                            ChatMessageDTO message,
                            Message<?> msg ) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(msg);
        UserTokenDTO userInfo = (UserTokenDTO) accessor.getSessionAttributes().get("user");


        message.setWorkspaceId(workspaceId);
        message.setChannelId(channelId);

        message.setSenderId(userInfo.getId());

        switch (message.getType()) {
            case "user":
                message.setId(UUID.randomUUID().toString());
                chatService.sendMessage(message, null);
                break;
//            case "system":
//                // 시스템 메시지는 DB에 저장할 수도 있고, 단순 알림으로만 보낼 수도 있음
//                chatService.saveSystemMessage(message);
//                break;
            case "like":
                chatReactionService.toggleLike(
                       message
                );
                break;

            case "emoji":
                chatReactionService.toggleEmoji(
                        message
                );
                break;

//
//            case "edit":
//                chatService.editMessage(message.getParentId(), message.getContent());
//                break;
//
//            case "delete":
//                chatService.deleteMessage(message.getParentId());
//                break;

            default:
                log.warn("Unknown message type: {}", message.getType());
                return;
        }


    }

    /**
     * Create랑 Read가 잘 되는지 테스트
     */

//    @PostMapping("/workspace/{workspaceId}/channel/{channelId}/send")
//    public ResponseEntity<Void> sendMessageTest(
//            @PathVariable Long workspaceId,
//            @PathVariable Long channelId,
//            @RequestBody ChatMessageDTO message,
//            @AuthenticationPrincipal UserTokenDTO userInfo) {
//
//        message.setWorkspaceId(workspaceId);
//        message.setChannelId(channelId);
//        message.setSenderId(userInfo.getId());
//        chatService.sendMessage(message, null);
//
//        return  ResponseEntity.ok().build();
//    }

    @GetMapping("/workspace/{workspaceId}/channel/{channelId}/message")
    public ResponseEntity<List<ChatMessageFromDBDTO>> getMessages(
            @PathVariable Long workspaceId,
            @PathVariable Long channelId
    ) {
        List<ChatMessageFromDBDTO> messages = chatService.getMessages(workspaceId, channelId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/workspace/{workspaceId}/channel/{channelId}/message/older")
    public ResponseEntity<List<ChatMessageFromDBDTO>> getOlderMessages(
            @PathVariable Long workspaceId,
            @PathVariable Long channelId,
            @RequestParam("beforeId") String beforeId // 마지막으로 불러온 메시지의 ID
    ) {
        List<ChatMessageFromDBDTO> messages =
                chatService.getOlderMessages(workspaceId, channelId, beforeId, 30);

        return ResponseEntity.ok(messages);
    }

}