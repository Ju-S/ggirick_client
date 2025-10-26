package com.kedu.ggirick_client_backend.controllers.chat;

import com.kedu.ggirick_client_backend.config.ChatConfig;
import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatChannelDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatChannelParticipantDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatWorkspaceDTO;
import com.kedu.ggirick_client_backend.dto.chat.ChatWorkspaceMemberDTO;
import com.kedu.ggirick_client_backend.services.chat.ChatChannelService;
import com.kedu.ggirick_client_backend.services.chat.ChatWorkspaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public List<ChatChannelDTO> getChannels(@PathVariable Long workspaceId,@AuthenticationPrincipal UserTokenDTO userInfo) {
        return workspaceService.getChannelsByWorkspaceId(workspaceId,userInfo.getId());
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
                              @RequestBody ChatChannelDTO channel,@AuthenticationPrincipal UserTokenDTO userInfo) {
        workspaceService.createChannel(workspaceId, channel,userInfo.getId(), ChatConfig.CHANNEL_PRIVATE_CODE);
    }

    // 채널 정보 수정
    @PatchMapping("/{workspaceId}/channels/{channelId}")
    public ResponseEntity<ChatChannelDTO> updateChannel(
            @PathVariable Long workspaceId,
            @PathVariable Long channelId,
            @RequestBody ChatChannelDTO updatedChannel,
            @AuthenticationPrincipal UserTokenDTO userInfo) {

        // 수정 가능한 권한 체크 (선택 사항)
        // workspaceService.checkChannelEditPermission(workspaceId, channelId, userInfo.getId());

        ChatChannelDTO result = channelService.updateChannel(workspaceId, channelId, updatedChannel);
        return ResponseEntity.ok(result);
    }

    //채널 멤버 싱크
    @PostMapping("/{workspaceId}/channels/{channelId}/members")
    public ResponseEntity<Map<String, Boolean>> syncProjectMembers(
            @PathVariable Long workspaceId, @PathVariable Long channelId,
            @RequestBody List<String> employeeIds) {

        boolean success = channelService.syncChannelParticipants(channelId,employeeIds);
        Map<String, Boolean> map = new HashMap<>();
        map.put("result", success);
        return ResponseEntity.ok(map);
    }

    //워크스페이스 멤버 싱크
    @PostMapping("/{workspaceId}/members")
    public ResponseEntity<Map<String, Boolean>> syncProjectMembers(
            @PathVariable Long workspaceId,
            @RequestBody List<String> employeeIds) {

        boolean success = workspaceService.syncWorkspaceMembers(workspaceId,employeeIds);
        Map<String, Boolean> map = new HashMap<>();
        map.put("result", success);
        return ResponseEntity.ok(map);
    }

    //DM 방개설 또는 조회 요청
    @PostMapping("/{workspaceId}/dm")
    public ResponseEntity<?> openOrCreateDM(
            @PathVariable Long workspaceId,
            @RequestBody Map<String, String> body
            ,@AuthenticationPrincipal UserTokenDTO userInfo) {
        String targetId = body.get("targetId");
        System.out.println("targetId = " + targetId);
        ChatChannelDTO dm = channelService.openOrCreateDMChannel(workspaceId, userInfo.getId(), targetId);
        return ResponseEntity.ok(dm);
    }

}