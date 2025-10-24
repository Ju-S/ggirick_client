package com.kedu.ggirick_client_backend.dao.chat;

import com.kedu.ggirick_client_backend.dto.chat.ChatChannelDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatWorkspaceDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatWorkspaceMemberDTO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository

public class ChatWorkspaceDAO {
    @Autowired
    private SqlSessionTemplate mybatis;

    //로그인한 사용자의 워크스페이스 목록 가져오기
    public List<ChatWorkspaceDTO> selectWorkspacesByUser(String employeeId) {
       return mybatis.selectList("ChatWorkspaceChannel.selectWorkspacesByUser",employeeId);
    }

    //해당 워크 스페이스 안에 있는 채널 목록 가져오기
    public List<ChatChannelDTO> selectChannelsByWorkspaceId(Long workspaceId) {
        return mybatis.selectList("ChatWorkspaceChannel.selectChannelsByWorkspaceId",workspaceId);
    }

    //워크스페이스 만들기
    public long createWorkspace(ChatWorkspaceDTO workspace) {
        mybatis.insert("ChatWorkspaceChannel.createWorkspace", workspace);
        return workspace.getId(); // selectKey로 세팅된 ID 반환
    }
    //채널 만들기

    public long insertChannel(ChatChannelDTO channel) {
        mybatis.insert("ChatWorkspaceChannel.createChannel", channel);
        return channel.getId(); // selectKey로 세팅된 ID 반환
    }

    //워크스페이스 멤버 등록하기
    public boolean insertWorkspaceMember(ChatWorkspaceMemberDTO memberDTO) {
       return mybatis.insert("ChatWorkspaceChannel.insertWorkspaceMember", memberDTO) > 0;
    }

    //워크스페이스 멤버 가져오기
    public List<ChatWorkspaceMemberDTO> getMembers(Long workspaceId) {
        return mybatis.selectList("ChatWorkspaceChannel.selectWorkspaceMembers", workspaceId);
    }
}
