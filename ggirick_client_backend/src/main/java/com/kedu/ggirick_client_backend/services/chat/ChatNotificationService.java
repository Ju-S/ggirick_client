package com.kedu.ggirick_client_backend.services.chat;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kedu.ggirick_client_backend.dao.chat.ChatDAO;
import com.kedu.ggirick_client_backend.dao.hr.EmployeeDAO;
import com.kedu.ggirick_client_backend.dto.chat.ChatMessageDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ChatNotificationService {

    @Autowired
    private final SimpMessagingTemplate template;
    @Autowired
    private ChatDAO chatDAO;
    @Autowired
    private EmployeeDAO employeeDAO;

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
    public void notifyChannelMembersUpdated(
            Long workspaceId,
            Long channelId,
            List<String> addedMembers,
            List<String> removedMembers
    ) {
        boolean hasAdd = addedMembers != null && !addedMembers.isEmpty();
        boolean hasRemove = removedMembers != null && !removedMembers.isEmpty();

        // 둘 다 비어있으면 종료
        if (!hasAdd && !hasRemove) return;

        // 이름 조회
        List<String> addedNames = hasAdd ? employeeDAO.selectEmployeeNamesByIds(addedMembers) : Collections.emptyList();
        List<String> removedNames = hasRemove ? employeeDAO.selectEmployeeNamesByIds(removedMembers) : Collections.emptyList();

        // 1️⃣ 추가된 멤버 알림
        if (hasAdd) {
            ChatMessageDTO addedMsg = new ChatMessageDTO();
            addedMsg.setId(UUID.randomUUID().toString());
            addedMsg.setWorkspaceId(workspaceId);
            addedMsg.setChannelId(channelId);
            addedMsg.setSenderId("ADMIN");
            addedMsg.setType("system");
            addedMsg.setCreatedAt(new Timestamp(System.currentTimeMillis()));

            String text = makeNaturalKoreanList(addedNames) + "님이 채널에 참여했습니다.";

            Map<String, Object> content = new HashMap<>();
            content.put("event", "CHANNEL_MEMBERS_ADDED");
            content.put("text", text);
            content.put("addedMembers", addedMembers);
            content.put("addedMemberNames", addedNames);

            try {
                ObjectMapper mapper = new ObjectMapper();
                addedMsg.setContent(mapper.writeValueAsString(content));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to serialize system message content", e);
            }

            chatDAO.saveMessage(addedMsg);
            template.convertAndSend("/subscribe/workspace/" + workspaceId + "/channel/" + channelId, addedMsg);
        }

        // 2️⃣ 제거된 멤버 알림
        if (hasRemove) {
            ChatMessageDTO removedMsg = new ChatMessageDTO();
            removedMsg.setId(UUID.randomUUID().toString());
            removedMsg.setWorkspaceId(workspaceId);
            removedMsg.setChannelId(channelId);
            removedMsg.setSenderId("ADMIN");
            removedMsg.setType("system");
            removedMsg.setCreatedAt(new Timestamp(System.currentTimeMillis()));

            String text = makeNaturalKoreanList(removedNames) + "님이 채널에서 나갔습니다.";

            Map<String, Object> content = new HashMap<>();
            content.put("event", "CHANNEL_MEMBERS_REMOVED");
            content.put("text", text);
            content.put("removedMembers", removedMembers);
            content.put("removedMemberNames", removedNames);

            try {
                ObjectMapper mapper = new ObjectMapper();
                removedMsg.setContent(mapper.writeValueAsString(content));
            } catch (JsonProcessingException e) {
                throw new RuntimeException("Failed to serialize system message content", e);
            }

            chatDAO.saveMessage(removedMsg);
            template.convertAndSend("/subscribe/workspace/" + workspaceId + "/channel/" + channelId, removedMsg);
        }
    }

    /**
     * 이름 리스트를 자연스러운 한국어 나열문으로 변환
     * 예: ["홍길동"] → "홍길동"
     *    ["홍길동", "김영희"] → "홍길동, 김영희"
     *    ["홍길동", "김영희", "이철수"] → "홍길동 외 2명"
     */
    private String makeNaturalKoreanList(List<String> names) {
        if (names == null || names.isEmpty()) return "";
        if (names.size() == 1) return names.get(0);
        if (names.size() == 2) return names.get(0) + ", " + names.get(1);
        return names.get(0) + " 외 " + (names.size() - 1) + "명";
    }





    /**
     * 워크스페이스 멤버 변경 알림
     */
    public void notifyWorkspaceMembersUpdated(Long workspaceId, List<String> memberIds) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "system");
        payload.put("event", "WORKSPACE_MEMBERS_UPDATED");
        payload.put("members", memberIds);
        payload.put("content", "워크스페이스 멤버가 변경되었습니다."); // 보여줄 메시지
        payload.put("createdAt", Instant.now());

        template.convertAndSend("/subscribe/workspace/" + workspaceId + "/members-updates", payload);
    }
}
