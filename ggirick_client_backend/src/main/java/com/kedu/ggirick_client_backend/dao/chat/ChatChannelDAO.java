package com.kedu.ggirick_client_backend.dao.chat;

import com.kedu.ggirick_client_backend.dto.chat.ChatChannelDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatChannelParticipantDTO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

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
    public void updateParticipantLeft(Long id){
        mybatis.update("ChatWorkspaceChannel.updateParticipantLeft");
    }


}
