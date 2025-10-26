package com.kedu.ggirick_client_backend.services.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatNotificationService {

    @Autowired
    private final SimpMessagingTemplate template;

    /**
     * 채널 삭제 알림
     */
    public void notifyChannelDeleted(Long workspaceId, Long channelId) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", UUID.randomUUID().toString());
        payload.put("type", "system");          // system 타입
        payload.put("event", "CHANNEL_DELETED"); // 이벤트 종류
        payload.put("channelId", channelId);
        payload.put("content", "채널이 삭제되었습니다."); // 보여줄 메시지
        payload.put("createdAt", Instant.now());


        template.convertAndSend("/subscribe/workspace/" + workspaceId + "/channel/" + channelId, payload);
    }

    /**
     * 채널 멤버 변경 알림
     */
    public void notifyChannelMembersUpdated(Long workspaceId, Long channelId, List<String> memberIds) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("id", UUID.randomUUID().toString());
        payload.put("type", "system");
        payload.put("event", "CHANNEL_MEMBERS_UPDATED");
        payload.put("channelId", channelId);
        payload.put("members", memberIds);
        payload.put("content", "채널 멤버가 변경되었습니다.."); // 보여줄 메시지
        payload.put("createdAt", Instant.now());

        template.convertAndSend("/subscribe/workspace/" + workspaceId + "/channel/" + channelId, payload);
    }

    /**
     * 워크스페이스 멤버 변경 알림
     */
    public void notifyWorkspaceMembersUpdated(Long workspaceId, List<String> memberIds) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "system");
        payload.put("event", "WORKSPACE_MEMBERS_UPDATED");
        payload.put("members", memberIds);
        payload.put("content", "워크스페이스 멤버가 변경되었습니다.."); // 보여줄 메시지
        payload.put("createdAt", Instant.now());

        template.convertAndSend("/subscribe/workspace/" + workspaceId + "/members-updates", payload);
    }
}
