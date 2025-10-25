package com.kedu.ggirick_client_backend.services.chat;

import com.kedu.ggirick_client_backend.dao.chat.ChatChannelDAO;
import com.kedu.ggirick_client_backend.dao.chat.ChatWorkspaceDAO;
import com.kedu.ggirick_client_backend.dto.chat.ChatChannelDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatChannelParticipantDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatWorkspaceDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatWorkspaceMemberDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import static com.kedu.ggirick_client_backend.config.ChatConfig.CHANNEL_DIRECT_CODE;
import static com.kedu.ggirick_client_backend.config.ChatConfig.MAX_CHANNELS;

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
    public List<ChatChannelDTO> getChannelsByWorkspaceId(Long workspaceId, String userId) {
        return chatWorkspaceDAO.selectChannelsByWorkspaceId(workspaceId,userId);
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

    public void createChannel(Long workspaceId, ChatChannelDTO channel,String createdBy, int channelType) {
        // 🔸 DM 채널이 아니라면 개수 제한 확인
        if (channelType != CHANNEL_DIRECT_CODE) {
            int nonDmCount = chatWorkspaceDAO.countChannelsByWorkspaceIdAndNotType(workspaceId, CHANNEL_DIRECT_CODE);
            if (nonDmCount >= MAX_CHANNELS) {
                throw new IllegalStateException("채널은 워크스페이스당 최대 " + MAX_CHANNELS + "개까지만 생성할 수 있습니다.");
            }
        }

        channel.setTypeId(channelType);

        channel.setWorkspaceId(workspaceId);

        //채널 만들고
        long channelId = chatWorkspaceDAO.insertChannel( channel);

        //채널 만든 사람은 해당 채널 참가자로 등록
        ChatChannelParticipantDTO participant = new ChatChannelParticipantDTO();
        participant.setChannelId(channelId);
        participant.setEmployeeId(createdBy);
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

    /**
     * 워크스페이스 멤버 동기화
     * - DB에 있는 워크스페이스 멤버와 프론트에서 넘어온 목록을 비교하여
     *   필요한 추가/삭제를 자동으로 수행
     */
    @Transactional
    public boolean syncWorkspaceMembers(Long workspaceId, List<String> employeeIds) {

        // DB에 현재 존재하는 워크스페이스 멤버 조회
        List<String> existingMembers = chatWorkspaceDAO.getMembers(workspaceId)
                .stream()
                .map(ChatWorkspaceMemberDTO::getEmployeeId)
                .collect(Collectors.toList());

        // 삭제할 대상: DB에는 있는데 프론트에서 빠진 경우 -> LEFT_AT 처리
        List<String> toRemove = existingMembers.stream()
                .filter(id -> !employeeIds.contains(id))
                .collect(Collectors.toList());

        // 추가할 대상: 프론트에는 있는데 DB에 없는 경우
        List<String> toAdd = employeeIds.stream()
                .filter(id -> !existingMembers.contains(id))
                .collect(Collectors.toList());

        // 삭제 처리 (LEFT_AT = SYSDATE)
        for (String id : toRemove) {
            ChatWorkspaceMemberDTO dto = new ChatWorkspaceMemberDTO();
            dto.setWorkspaceId(workspaceId);
            dto.setEmployeeId(id);
            chatWorkspaceDAO.updateWorkspaceParticipantLeftAt(dto);
        }

        // 추가 처리 (기존 레코드가 있으면 LEFT_AT NULL, 없으면 insert)
        for (String id : toAdd) {
            ChatWorkspaceMemberDTO dto = new ChatWorkspaceMemberDTO();
            dto.setWorkspaceId(workspaceId);
            dto.setEmployeeId(id);
            dto.setRoleId(WORKSPACE_MEMBER_CODE);
            chatWorkspaceDAO.insertorUpdateWorkspaceMember(dto);
        }

        return true;
    }

}