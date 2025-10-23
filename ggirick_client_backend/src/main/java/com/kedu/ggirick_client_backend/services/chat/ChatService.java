package com.kedu.ggirick_client_backend.services.chat;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatDto;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;

@Service
public class ChatService {


    public ChatDto createChat(Long workspaceId, Long channelId,String message, String loginId) {
//        // 워크스페이스와 채널 유효성 검증
//        if (!workspaceRepository.existsById(workspaceId)) {
//            throw new IllegalArgumentException("존재하지 않는 워크스페이스입니다.");
//        }
//        if (!channelRepository.existsByIdAndWorkspaceId(channelId, workspaceId)) {
//            throw new IllegalArgumentException("해당 워크스페이스에 속하지 않는 채널입니다.");
//        }
//
//        User sender = userRepository.findByLoginId(senderId)
//                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 사용자입니다."));
//
//        Chat chat = Chat.builder()
//                .workspaceId(workspaceId)
//                .channelId(channelId)
//                .sender(sender)
//                .message(content)
//                .build();
//
//        chatRepository.save(chat);
//
//        return ChatDto.fromEntity(chat);


        return new ChatDto();
    }
}
