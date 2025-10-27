package com.kedu.ggirick_client_backend.dao.chat;

import com.kedu.ggirick_client_backend.dto.chat.ChatChannelDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatWorkspaceDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatWorkspaceMemberDTO;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository

public class ChatWorkspaceDAO {
    @Autowired
    private SqlSessionTemplate mybatis;

    //로그인한 사용자의 워크스페이스 목록 가져오기
    public List<ChatWorkspaceDTO> selectWorkspacesByUser(String employeeId) {
       return mybatis.selectList("ChatWorkspaceChannel.selectWorkspacesByUser",employeeId);
    }

    //해당 워크 스페이스 안에 있는 채널 목록 가져오기
    public List<ChatChannelDTO> selectChannelsByWorkspaceId(Long workspaceId, String userId) {
        Map<String,Object> map = new HashMap<>();
        map.put("workspaceId",workspaceId);
        map.put("userId",userId);
        return mybatis.selectList("ChatWorkspaceChannel.selectChannelsByWorkspaceId",map);
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


    public void updateWorkspaceParticipantLeftAt(ChatWorkspaceMemberDTO dto) {
        mybatis.update("ChatWorkspaceChannel.updateWorkspaceParticipantLeftAt", dto);
    }

    public void insertorUpdateWorkspaceMember(ChatWorkspaceMemberDTO dto) {
        int updated = mybatis.update("ChatWorkspaceChannel.restoreWorkspaceParticipantIfExists", dto);
        if(updated==0){
            mybatis.insert("ChatWorkspaceChannel.insertWorkspaceMember", dto);
        }
    }
    /*
    workspace 안의 해당 타입 채널 수 세기
     */
    public int countChannelsByWorkspaceIdAndNotType(Long workspaceId, int excludedTypeId) {
        Map<String,Object> map = new HashMap<>();
        map.put("workspaceId",workspaceId);
        map.put("excludedTypeId",excludedTypeId);
        return mybatis.selectOne("ChatWorkspaceChannel.countChannelsByWorkspaceIdAndNotType", map);
    }

    /**
     * 워크스페이스 Soft Delete
     * deleted_at에 현재 시각 기록
     */
    public boolean deleteWorkspace(Long workspaceId) {
        return mybatis.update("ChatWorkspaceChannel.deleteWorkspace", workspaceId) > 0;
    }

    /**
     * 채널 Soft Delete
     * deleted_at에 현재 시각 기록
     */
    public boolean deleteChannel(Long channelId) {
        return mybatis.update("ChatWorkspaceChannel.deleteChannel", channelId) > 0;
    }

    /**
     * 채널에 속한 메시지 Soft Delete
     */
    public boolean deleteMessagesByChannelId(Long channelId) {
        return mybatis.update("ChatWorkspaceChannel.deleteMessagesByChannelId", channelId) > 0;
    }

    public String selectWorkspaceRoleNameById(Long workspaceId,String userId) {
        Map<String,Object> map = new HashMap<>();
        map.put("workspaceId",workspaceId);
        map.put("employeeId",userId);
        return mybatis.selectOne("ChatWorkspaceChannel.selectWorkspaceRoleNameByUser",map);
    }

    //아이디ㅣ로 워크스페이스 검색하기
    public ChatWorkspaceDTO selectWorkspaceById(Long workspaceId) {
         return mybatis.selectOne("ChatWorkspaceChannel.selectWorkspaceById", workspaceId);
        }

    public void updateWorkspace(ChatWorkspaceDTO existing) {
        mybatis.update("ChatWorkspaceChannel.updateWorkspace", existing);
    }
}
