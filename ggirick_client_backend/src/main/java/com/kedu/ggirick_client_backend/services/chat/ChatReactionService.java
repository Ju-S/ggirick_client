package com.kedu.ggirick_client_backend.services.chat;

import com.kedu.ggirick_client_backend.dao.chat.ChatDAO;
import com.kedu.ggirick_client_backend.dto.chat.ChatMessageDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;


@Slf4j
@Service
public class ChatReactionService{
    @Autowired
    private ChatDAO chatDao;
    @Autowired
    SimpMessagingTemplate messagingTemplate;

    public void toggleEmoji(ChatMessageDTO m) {
        boolean exists = chatDao.existsReaction(m);
        try {
            if (exists) {
                chatDao.deleteReaction(m);
            } else {
                chatDao.insertReaction(m);
            }
        } catch (DuplicateKeyException e) {
            // 동시 클릭으로 중복 insert가 발생한 경우 → 무시
            log.warn("[WARN] Duplicate reaction ignored: " + m.getEmoji());
        }


        // 🔔 구독중인 클라이언트에게 실시간 반영 (STOMP broadcast)
        Map<String, Object> payload = Map.of(
                "type", "emoji",
                "messageId", m.getParentId(),
                "employeeId", m.getSenderId(),
                "emoji", m.getEmoji(),
                "reacted", !exists
        );

        messagingTemplate.convertAndSend(
                "/subscribe/workspace/" + m.getWorkspaceId() + "/channel/" + m.getChannelId(),
                payload
        );


    }

    public void toggleLike(ChatMessageDTO m) {
        boolean liked = chatDao.existsLike(m);
        try {
            if (liked) chatDao.deleteLike(m);
            else chatDao.insertLike(m);
        } catch (DuplicateKeyException e) {
            // 동시 클릭으로 중복 insert가 발생한 경우 → 무시
            log.warn("[WARN] Duplicate reaction ignored: " + liked);
        }

        messagingTemplate.convertAndSend(
                "/subscribe/workspace/" + m.getWorkspaceId() + "/channel/" + m.getChannelId(),
                Map.of("type", "like", "parentId", m.getParentId(), "employeeId", m.getSenderId(), "liked", !liked)
        );
    }

    public void toggleViewer(ChatMessageDTO m) {
        log.info("워크스페이스"+m.getWorkspaceId()+"채널"+m.getWorkspaceId()+"해당 메시지"+m.getParentId());
        boolean viewed = chatDao.existsViewed(m);
        try{
            if(viewed) chatDao.deleteView(m);
            else chatDao.insertView(m);

        }catch (DuplicateKeyException e){
            log.warn("[WARN] Duplicate view ignored: " + viewed);
        }

        messagingTemplate.convertAndSend("/subscribe/workspace/" + m.getWorkspaceId() + "/channel/" + m.getChannelId(),
                Map.of("type", "viewer", "parentId", m.getParentId(), "employeeId", m.getSenderId(), "viewed", !viewed));
    }
}
