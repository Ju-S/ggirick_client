package com.kedu.ggirick_client_backend.controllers.chat;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatChannelDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatChannelParticipantDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatWorkspaceDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatWorkspaceMemberDTO;
import com.kedu.ggirick_client_backend.services.chat.ChatChannelService;
import com.kedu.ggirick_client_backend.services.chat.ChatWorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/workspace")
public class ChatWorkspaceChannelController {

    private final ChatWorkspaceService workspaceService;
    private final ChatChannelService channelService;

    // 로그인한 사용자의 워크스페이스 목록 조회
    @GetMapping
    public List<ChatWorkspaceDTO> getUserWorkspaces(@AuthenticationPrincipal UserTokenDTO userInfo) {
        return workspaceService.getWorkspacesByUser(userInfo.getId());
    }

    // 워크스페이스 내 채널 목록 조회
    @GetMapping("/{workspaceId}/channels")
    public List<ChatChannelDTO> getChannels(@PathVariable Long workspaceId) {
        return workspaceService.getChannelsByWorkspaceId(workspaceId);
    }


    //워크스페이스 참가자 가져오기
    @GetMapping("/{workspaceId}/members")
    public List<ChatWorkspaceMemberDTO> getMembers(@PathVariable Long workspaceId,@AuthenticationPrincipal UserTokenDTO userInfo) {
        String loginId = userInfo.getId();
        return workspaceService.getWorkspaceMembers(workspaceId, loginId);
    }

    //채널 참가자 가져오기
    @GetMapping("/{workspaceId}/channels/{channelId}/members")
    public List<ChatChannelParticipantDTO> getChannelParticipants(@PathVariable Long workspaceId, @PathVariable Long channelId,@AuthenticationPrincipal UserTokenDTO userInfo) {
        String loginId = userInfo.getId();
        return channelService.selectChannelParticipantsByChannelId(channelId, loginId);
    }

    //워크스페이스 생성
    @PostMapping
    public void createWorkspace(@RequestBody ChatWorkspaceDTO workspace,
                                @AuthenticationPrincipal UserTokenDTO userInfo) {
        workspaceService.createWorkspace(workspace, userInfo.getId());
    }

    // 워크스페이스 내 채널 생성
    @PostMapping("/{workspaceId}/channels")
    public void createChannel(@PathVariable Long workspaceId,
                              @RequestBody ChatChannelDTO channel) {
        workspaceService.createChannel(workspaceId, channel);
    }

}