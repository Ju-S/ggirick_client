package com.kedu.ggirick_client_backend.services.chat;

import com.kedu.ggirick_client_backend.dao.chat.ChatChannelDAO;
import com.kedu.ggirick_client_backend.dao.chat.ChatWorkspaceDAO;
import com.kedu.ggirick_client_backend.dto.chat.ChatChannelDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatChannelParticipantDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatChannelService {

    @Autowired
    private ChatChannelDAO chatChannelDAO;


    public List<ChatChannelParticipantDTO> selectChannelParticipantsByChannelId(Long channelId, String userId) {
        // 1. 사용자가 속한 채널 목록 조회
        List<ChatChannelDTO> myChannels = chatChannelDAO.selectChannelsByUserId(userId);

        // 2. 요청한 channelId가 내가 속한 채널인지 확인
        boolean belongs = myChannels.stream()
                .anyMatch(ch -> ch.getId().equals(channelId));

        if (!belongs) {
            throw new IllegalArgumentException("해당 채널에 대한 접근 권한이 없습니다.");
            // 필요하다면 ForbiddenException 등으로 바꿔도 됨
        }

        // 3. 권한 확인 후 참가자 조회
        return chatChannelDAO.selectChannelParticipantsByChannelId(channelId);
    }



}
