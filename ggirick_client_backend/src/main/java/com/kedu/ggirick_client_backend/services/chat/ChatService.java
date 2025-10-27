package com.kedu.ggirick_client_backend.services.chat;

import com.kedu.ggirick_client_backend.dao.chat.ChatDAO;
import com.kedu.ggirick_client_backend.dto.chat.ChatFileDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatMessageDTO;

import com.kedu.ggirick_client_backend.dto.chat.ChatMessageFromDBDTO;
import com.kedu.ggirick_client_backend.dto.chat.ReactionDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ChatService {

    @Autowired
    private ChatDAO chatDao;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;


    public void sendMessage(ChatMessageDTO message, List<ChatFileDTO> files) {
        chatDao.saveMessage(message) ;

        if (files != null) {
            for (ChatFileDTO file : files) {
                file.setMessageId(message.getId());
                 chatDao.saveFile(file);
            }
        }
        messagingTemplate.convertAndSend(
                "/subscribe/workspace/" + message.getWorkspaceId() + "/channel/" + message.getChannelId(),
                message
        );
    }

    public List<ChatMessageFromDBDTO> getMessages(Long workspaceId, Long channelId) {
        List<ChatMessageFromDBDTO> messages = chatDao.selectMessagesByChannel(workspaceId, channelId);
        if (messages.isEmpty()) return Collections.emptyList();

        Collections.reverse(messages);
        return processFastMessage(messages);
    }

    public List<ChatMessageFromDBDTO> getOlderMessages(Long workspaceId, Long channelId, String beforeId, int limit) {
        // 먼저 기준 메시지의 created_at 조회
        LocalDateTime beforeTime = chatDao.getMessageCreatedAt(beforeId);
        if (beforeTime == null) return Collections.emptyList();

        //  beforeTime보다 이전 메시지 가져오기
        Map<String, Object> params = new HashMap<>();
        params.put("workspaceId", workspaceId);
        params.put("channelId", channelId);
        params.put("beforeTime", beforeTime);
        params.put("limit", limit);

        List<ChatMessageFromDBDTO> messages = chatDao.selectOlderMessages(params);

        // DB에서는 DESC로 가져오니까 프론트 순서 맞추기
        Collections.reverse(messages);

        return processFastMessage(messages);
    }

    public List<ChatMessageFromDBDTO> processFastMessage(List<ChatMessageFromDBDTO> messages){
        List<String> messageIds = messages.stream().map(ChatMessageFromDBDTO::getId).collect(Collectors.toList());
        if (messageIds.isEmpty()) {
            return messages;
        }

        // 일괄 좋아요/리액션 조회
        Map<String, Integer> likeCounts = chatDao.getLikeCounts(messageIds).stream()
                .collect(Collectors.toMap(
                        r -> (String) r.get("ID"),
                        r -> ((Number) r.get("CNT")).intValue()
                ));

        Map<String, List<String>> likeUsers = chatDao.getLikeUsersMap(messageIds).stream()
                .collect(Collectors.groupingBy(
                        r -> (String) r.get("MESSAGE_ID"),
                        Collectors.mapping(r -> (String) r.get("EMPLOYEE_ID"), Collectors.toList())
                ));
        Map<String, List<String>> viewers = chatDao.getViewersMap(messageIds).stream()
                .collect(Collectors.groupingBy(
                        r -> (String) r.get("MESSAGE_ID"),
                        Collectors.mapping(r -> (String) r.get("EMPLOYEE_ID"), Collectors.toList())
                ));

        Map<String, List<ReactionDTO>> reactions = chatDao.getReactionsMap(messageIds).stream()
                .collect(Collectors.groupingBy(
                        r -> (String) r.get("MESSAGE_ID"),
                        Collectors.mapping(
                                r -> new ReactionDTO(
                                        (String) r.get("EMOJI"),
                                        List.of((String) r.get("EMPLOYEE_ID"))
                                ),
                                Collectors.toList()
                        )
                ));
        // 메시지에 매핑
        for (ChatMessageFromDBDTO m : messages) {
            m.setLike_count(likeCounts.getOrDefault(m.getId(), 0));
            m.setLikeUsers(likeUsers.getOrDefault(m.getId(), List.of()));
            m.setReactions(reactions.getOrDefault(m.getId(), List.of()));
            m.setViewer(viewers.getOrDefault(m.getId(), List.of()));
        }

        return messages;
    }

    public List<ChatMessageFromDBDTO> processMessage(List<ChatMessageFromDBDTO> messages) {
        return  messages.stream().map(m -> {

            //좋아요 세팅
            m.setLike_count(chatDao.getLikeCount(m));

            //좋아요 한 유저 세팅
            m.setLikeUsers(chatDao.whoseLikeMessage(m));

            //리액션 세팅
            List<Map<String, String>> reactionRows = chatDao.getReactionsForMessage(m.getId());

            Map<String, List<String>> grouped = reactionRows.stream()
                    .filter(r -> r.get("EMOJI") != null)  // null인 emoji 제거
                    .collect(Collectors.groupingBy(
                            r -> r.get("EMOJI"),
                            Collectors.mapping(r -> r.get("EMPLOYEE_ID"), Collectors.toList())
                    ));


            List<ReactionDTO> reactions = grouped.entrySet().stream()
                    .map(e -> new ReactionDTO(e.getKey(), e.getValue()))
                    .collect(Collectors.toList());

            m.setReactions(reactions);

            return m;
        }).collect(Collectors.toList());
    };

    public void saveFile(ChatMessageDTO chatDto, String fileName, String fileUrl) {
        if (fileUrl == null || fileName == null) {
            log.warn("파일 정보가 유효하지 않아 저장하지 않습니다. messageId={}", chatDto.getId());
            return;
        }

        ChatFileDTO fileDTO = new ChatFileDTO();
        fileDTO.setMessageId(chatDto.getId());
        fileDTO.setFilename(fileName);
        fileDTO.setFileUrl(fileUrl);
        fileDTO.setChannelId(chatDto.getChannelId());
        fileDTO.setWorkspaceId(chatDto.getWorkspaceId());

        chatDao.insertChatFile(fileDTO);

        log.info("파일 저장 완료: {}", fileDTO);
    }

//    // 시스템 메시지 저장
//    public boolean saveSystemMessage(ChatMessageDTO message) {
//        return chatDao.insertSystemMessage(message) > 0;
//    }


}
