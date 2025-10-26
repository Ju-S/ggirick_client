package com.kedu.ggirick_client_backend.controllers.chat;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatMessageDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatMessageFromDBDTO;
import com.kedu.ggirick_client_backend.dto.chat.ContentBlock;
import com.kedu.ggirick_client_backend.services.chat.ChatReactionService;
import com.kedu.ggirick_client_backend.services.chat.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.kedu.ggirick_client_backend.config.ChatConfig.additionalMessageSize;

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
                            Message<?> msg ) throws JsonProcessingException {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(msg);
        UserTokenDTO userInfo = (UserTokenDTO) accessor.getSessionAttributes().get("user");


        message.setWorkspaceId(workspaceId);
        message.setChannelId(channelId);

        message.setSenderId(userInfo.getId());

        switch (message.getType()) {
            /**
             * message의 타입필드를 통해 메시지의 종류를 구분함
             *
             * user라고 붙은 경우가 메시지를 유저가 직접 보낸 채팅메시지의 경우
             */
            case "user":
                message.setId(UUID.randomUUID().toString());

                if (message.isHasFile()) {
                    ObjectMapper objectMapper = new ObjectMapper();
                    List<ContentBlock> contentBlocks = objectMapper.readValue(
                            message.getContent(),
                            new TypeReference<List<ContentBlock>>() {}
                    );

                    contentBlocks.stream()
                            .filter(block -> Arrays.asList("audio", "video", "image","file").contains(block.getType()))
                            .forEach(block -> {
                                Map<String, Object> props = block.getProps();
                                chatService.saveFile(
                                        message,
                                        (String) props.get("name"),
                                        (String) props.get("url")


                                );
                            });
                }
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
     * 초기 메시지를 가져오는 컨트롤러
     */
    @GetMapping("/workspace/{workspaceId}/channel/{channelId}/message")
    public ResponseEntity<List<ChatMessageFromDBDTO>> getMessages(
            @PathVariable Long workspaceId,
            @PathVariable Long channelId
    ) {
        List<ChatMessageFromDBDTO> messages = chatService.getMessages(workspaceId, channelId);
        return ResponseEntity.ok(messages);
    }
    /**
     * 더 오래된 메시지를 가져오는 컨트롤러
     */
    @GetMapping("/workspace/{workspaceId}/channel/{channelId}/message/older")
    public ResponseEntity<List<ChatMessageFromDBDTO>> getOlderMessages(
            @PathVariable Long workspaceId,
            @PathVariable Long channelId,
            @RequestParam("beforeId") String beforeId // 마지막으로 불러온 메시지의 ID
    ) {
        List<ChatMessageFromDBDTO> messages =
                chatService.getOlderMessages(workspaceId, channelId, beforeId, additionalMessageSize);

        return ResponseEntity.ok(messages);
    }



}