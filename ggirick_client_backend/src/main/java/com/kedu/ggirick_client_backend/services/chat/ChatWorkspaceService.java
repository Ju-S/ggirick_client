package com.kedu.ggirick_client_backend.services.chat;

import com.kedu.ggirick_client_backend.dao.chat.ChatChannelDAO;
import com.kedu.ggirick_client_backend.dao.chat.ChatWorkspaceDAO;
import com.kedu.ggirick_client_backend.dto.chat.ChatChannelDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatChannelParticipantDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatWorkspaceDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatWorkspaceMemberDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatWorkspaceService {

    private final Long WORKSPACE_ADMIN_CODE = 1L;
    private final  Long WORKSPACE_MANAGER_CODE = 2L;
    private final  Long WORKSPACE_MEMBER_CODE = 3L;

    private final ChatWorkspaceDAO chatWorkspaceDAO;
    private final ChatChannelDAO  chatChannelDAO;

    //로그인한 사용자의 워크스페이스 가져오기 
    public List<ChatWorkspaceDTO> getWorkspacesByUser(String employeeId) {
        return chatWorkspaceDAO.selectWorkspacesByUser(employeeId);
    }

    //워크스페이스 id에 따라 채널 가져오기
    public List<ChatChannelDTO> getChannelsByWorkspaceId(Long workspaceId) {
        return chatWorkspaceDAO.selectChannelsByWorkspaceId(workspaceId);
    }

    //워크스페이스 만들기
    public void createWorkspace(ChatWorkspaceDTO workspace, String createdBy) {
       //워크 스페이스를 만든 사용자 아이디 설정
        workspace.setCreatedBy(createdBy);
        //워크스페이스 만들고
        long workspaceId = chatWorkspaceDAO.createWorkspace(workspace);

        ChatWorkspaceMemberDTO memberDTO = new ChatWorkspaceMemberDTO();
        memberDTO.setWorkspaceId(workspaceId);
        memberDTO.setEmployeeId(createdBy);
        memberDTO.setRoleId(WORKSPACE_ADMIN_CODE);

        //워크스페이스 멤버로 등록
        chatWorkspaceDAO.insertWorkspaceMember(memberDTO);

    }

    public void createChannel(Long workspaceId, ChatChannelDTO channel) {
        channel.setWorkspaceId(workspaceId);

        //채널 만들고
        long channelId = chatWorkspaceDAO.insertChannel( channel);

        //해당 채널 참가자로 등록
        ChatChannelParticipantDTO participant = new ChatChannelParticipantDTO();
        participant.setChannelId(channelId);
        chatChannelDAO.insertChannelParticipant(participant);
    }

    public List<ChatWorkspaceMemberDTO> getWorkspaceMembers(Long workspaceId, String loginId) {
        // 1. 사용자가 속한 워크스페이스 리스트 조회
        List<ChatWorkspaceDTO> userWorkspaces = getWorkspacesByUser(loginId);

        // 2. 요청한 workspaceId가 내가 속한 워크스페이스인지 확인
        boolean belongs = userWorkspaces.stream()
                .anyMatch(ws -> ws.getId().equals(workspaceId));

        if (!belongs) {
            throw new IllegalArgumentException("해당 워크스페이스에 대한 접근 권한이 없습니다.");
        }

        // 3. 권한 확인 후 멤버 조회
        return chatWorkspaceDAO.getMembers(workspaceId);
    }

}