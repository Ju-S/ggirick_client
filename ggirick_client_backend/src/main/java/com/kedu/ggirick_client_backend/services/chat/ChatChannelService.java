package com.kedu.ggirick_client_backend.services.chat;

import com.kedu.ggirick_client_backend.config.ChatConfig;
import com.kedu.ggirick_client_backend.dao.chat.ChatChannelDAO;
import com.kedu.ggirick_client_backend.dao.chat.ChatDAO;
import com.kedu.ggirick_client_backend.dao.chat.ChatWorkspaceDAO;
import com.kedu.ggirick_client_backend.dto.chat.ChatChannelDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatChannelParticipantDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatFileDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatWorkspaceDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatChannelService {

    @Autowired
    private ChatChannelDAO chatChannelDAO;

    @Autowired
    private ChatWorkspaceDAO chatWorkspaceDAO;

    @Autowired
    private ChatNotificationService chatNotificationService;
    @Autowired
    private ChatDAO chatDAO;


    //채널 아이디 참가자 확인하기
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


    /**
     * 채널 참여자 동기화
     * - DB에 있는 참여자 목록과 프론트에서 넘어온 목록을 비교하여
     *   필요한 추가/삭제를 자동으로 수행함.
     */
    @Transactional
    public boolean syncChannelParticipants(Long workspaceId, Long channelId, List<String> employeeIds) {

        //  현재 DB에 존재하는 참여자 조회
        List<String> existingParticipants = chatChannelDAO.selectChannelParticipantsByChannelId(channelId)
                .stream()
                .map(ChatChannelParticipantDTO::getEmployeeId)
                .collect(Collectors.toList());

        //  삭제할 대상: DB에는 있는데 프론트에서 빠진 경우
        List<String> toRemove = existingParticipants.stream()
                .filter(id -> !employeeIds.contains(id))
                .collect(Collectors.toList());

        //  추가할 대상: 프론트에는 있는데 DB에 없는 경우
        List<String> toAdd = employeeIds.stream()
                .filter(id -> !existingParticipants.contains(id))
                .collect(Collectors.toList());

        //  삭제 처리
        for (String id : toRemove) {
            ChatChannelParticipantDTO dto = new ChatChannelParticipantDTO();
            dto.setChannelId(channelId);
            dto.setEmployeeId(id);
            chatChannelDAO.deleteChannelParticipant(dto);
        }

        // 5추가 처리
        for (String id : toAdd) {
            ChatChannelParticipantDTO dto = new ChatChannelParticipantDTO();
            dto.setChannelId(channelId);
            dto.setEmployeeId(id);
            chatChannelDAO.insertorUpdateChannelParticipant(dto);
        }

        chatNotificationService.notifyChannelMembersUpdated(workspaceId, channelId, employeeIds);

        return true;
    }

    /*
    DM 채팅방 만들기
     */
    @Transactional
    public ChatChannelDTO openOrCreateDMChannel(Long workspaceId, String myId, String targetId) {

        // 1. 기존 DM 채널이 있는지 확인
        ChatChannelDTO existing = chatChannelDAO.selectDMChannelByMembers(workspaceId, myId, targetId);
        if (existing != null) {
            return existing;
        }

        // 2. 없으면 새 DM 채널 생성
        ChatChannelDTO dm = new ChatChannelDTO();
        dm.setWorkspaceId(workspaceId);
        dm.setTypeId(ChatConfig.CHANNEL_DIRECT_CODE); // DM 타입
        dm.setName("다이렉트 메시지 채널"); // DM은 이름 없음
        dm.setDescription("1:1 대화방 입니다");
        chatWorkspaceDAO.insertChannel(dm); // 생성 후 dm.id 세팅됨 (selectKey)

        // 3. 참여자 추가 - 중복 insert 대비
        Arrays.asList(myId, targetId).forEach(id -> {
            ChatChannelParticipantDTO p = new ChatChannelParticipantDTO();
            p.setChannelId(dm.getId());
            p.setEmployeeId(id);
            try {
                chatChannelDAO.insertorUpdateChannelParticipant(p);
            } catch (Exception e) {
                // 이미 존재하면 무시
            }
        });


        return dm;
    }

    // 채널 정보 수정
    public ChatChannelDTO updateChannel(Long workspaceId, Long channelId, ChatChannelDTO updatedChannel) {
        // 기존 채널 가져오기
        ChatChannelDTO existing = chatChannelDAO.selectChannelById(channelId);
        if (existing == null) {
            throw new RuntimeException("채널을 찾을 수 없습니다.");
        }

        // 수정 가능한 필드만 적용 (예: name, description)
        existing.setName(updatedChannel.getName());
        existing.setDescription(updatedChannel.getDescription());

        // DB 업데이트
        chatChannelDAO.updateChannel(existing);

        return existing;
    }


    public List<ChatFileDTO> listFilesByChannel(Long workspaceId, Long channelId) {
        return chatChannelDAO.selectFilesByChannel(workspaceId, channelId);
    }
}
