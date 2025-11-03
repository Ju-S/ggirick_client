package com.kedu.ggirick_client_backend.controllers.chat;

import com.kedu.ggirick_client_backend.config.ChatConfig;
import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.chat.*;
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

    //채널 내 채널인지 확인하기
    @GetMapping("/{workspaceId}/channels/{channelId}/myChannel")
    public ResponseEntity<Map<String,Boolean>> isMyChannel(@PathVariable Long workspaceId, @PathVariable Long channelId, @AuthenticationPrincipal UserTokenDTO userInfo) {
        String loginId = userInfo.getId();
        boolean success = channelService.selectChannelIsMyChannel(channelId, loginId);
        Map<String,Boolean> map = new HashMap<>();
        map.put("success",success);
        return ResponseEntity.ok(map);
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
        workspaceService.createChannel(workspaceId, channel,userInfo.getId(), ChatConfig.CHANNEL_PUBLIC_CODE);
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

    // 워크스페이스 정보 수정
    @PatchMapping("/{workspaceId}")
    public ResponseEntity<ChatWorkspaceDTO> updateWorkspace(
            @PathVariable Long workspaceId,

            @RequestBody ChatWorkspaceDTO updatedWorkspace,
            @AuthenticationPrincipal UserTokenDTO userInfo) {

        // 수정 가능한 권한 체크 (선택 사항)
        // workspaceService.checkWorkspaceEditPermission(workspaceId,  userInfo.getId());

        ChatWorkspaceDTO result = workspaceService.updateWorkspace(workspaceId,  updatedWorkspace);
        return ResponseEntity.ok(result);
    }

    //채널 멤버 싱크
    @PostMapping("/{workspaceId}/channels/{channelId}/members")
    public ResponseEntity<Map<String, Boolean>> syncProjectMembers(
            @PathVariable Long workspaceId, @PathVariable Long channelId,
            @RequestBody List<String> employeeIds) {

        boolean success = channelService.syncChannelParticipants(workspaceId, channelId,employeeIds);
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

    /**
     * 워크스페이스 삭제 (Soft Delete)
     */
    @DeleteMapping("/{workspaceId}")
    public ResponseEntity<Map<String, Boolean>> deleteWorkspace(
            @PathVariable Long workspaceId,
            @AuthenticationPrincipal UserTokenDTO userInfo) {

        workspaceService.deleteWorkspace(workspaceId,userInfo.getId());
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", true);
        return ResponseEntity.ok(response);
    }

    /**
     * 채널 삭제 (Soft Delete)
     */
    @DeleteMapping("/{workspaceId}/channels/{channelId}")
    public ResponseEntity<Map<String, Boolean>> deleteChannel(
            @PathVariable Long workspaceId,
            @PathVariable Long channelId,
            @AuthenticationPrincipal UserTokenDTO userInfo) {

        workspaceService.deleteChannel(workspaceId, channelId);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", true);
        return ResponseEntity.ok(response);
    }

    /**
    이 워크스페이스에서의 내 역할 조회
     */
    @GetMapping("/{workspaceId}/myrole")
    public ResponseEntity<String> getWorkspaceRole(
            @PathVariable Long workspaceId,
            @AuthenticationPrincipal  UserTokenDTO userInfo
    ) {
        String role = workspaceService.getUserRoleInWorkspace(workspaceId, userInfo.getId());
        return ResponseEntity.ok(role);
    }

    /**
     *
     * @param workspaceId
     * @param channelId
     * @return 파일 목록 ㅇㅇ
     */
    @GetMapping("/{workspaceId}/channels/{channelId}/files")
    public List<ChatFileDTO> listFiles(
            @PathVariable Long workspaceId,
            @PathVariable Long channelId
    ) {
        return channelService.listFilesByChannel(workspaceId, channelId);
    }

}