package com.kedu.ggirick_client_backend.dao.chat;

import com.kedu.ggirick_client_backend.dto.chat.ChatChannelDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatChannelParticipantDTO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class ChatChannelDAO {

    @Autowired
    private SqlSessionTemplate mybatis;

    //내가 속한 채널 조회
    public List<ChatChannelDTO> selectChannelsByUserId(String id){
        return mybatis.selectList("ChatWorkspaceChannel.selectChannelsByUserId", id);
    }

    //채널에 참가자 추가
    public void insertChannelParticipant(ChatChannelParticipantDTO participant){
        mybatis.insert("ChatWorkspaceChannel.insertChannelParticipant",participant);
    }

    //채널에 참가한 사람조회
    public List<ChatChannelParticipantDTO> selectChannelParticipantsByChannelId(Long channelId){
        return mybatis.selectList("ChatWorkspaceChannel.selectChannelParticipantsByChannelId",channelId);
    }

    //채널에서 퇴장 처리
    public void deleteChannelParticipant(ChatChannelParticipantDTO dto) {
        mybatis.update("ChatWorkspaceChannel.updateParticipantLeftAt", dto);
    }

    //채널에 참가시키거나 퇴장상태 삭제
    public void insertorUpdateChannelParticipant(ChatChannelParticipantDTO dto) {
        int updated = mybatis.update("ChatWorkspaceChannel.restoreParticipantIfExists", dto);
        if (updated == 0) {
            mybatis.insert("ChatWorkspaceChannel.insertChannelParticipant", dto);
        }
    }

    public ChatChannelDTO selectDMChannelByMembers(Long workspaceId, String employeeId1, String employeeId2) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("workspaceId", workspaceId);
        map.put("employeeId1", employeeId1);
        map.put("employeeId2", employeeId2);
        return mybatis.selectOne("ChatWorkspaceChannel.findExistDMChannel", map);
    }

    public ChatChannelDTO selectChannelById(Long channelId) {
        return mybatis.selectOne("ChatWorkspaceChannel.selectChannelById", channelId);
    }

    public void updateChannel(ChatChannelDTO existing) {
        mybatis.update("ChatWorkspaceChannel.updateChannel", existing);
    }
}
