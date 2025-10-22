package com.kedu.ggirick_client_backend.controllers.board;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.board.BoardGroupDTO;
import com.kedu.ggirick_client_backend.services.board.BoardGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/board/group")
@RequiredArgsConstructor
public class BoardGroupController {
    private final BoardGroupService boardGroupService;

    // 사용자 게시판 그룹 조회
    @GetMapping
    public ResponseEntity<List<BoardGroupDTO>> getBoardGroupList(@AuthenticationPrincipal UserTokenDTO userInfo) {
        return ResponseEntity.ok(boardGroupService.getGroupList(userInfo.getId()));
    }

    // 게시판 그룹 생성
    @PostMapping
    public ResponseEntity<Void> addBoardGroup(@RequestBody BoardGroupDTO groupInfo,
                                              @AuthenticationPrincipal UserTokenDTO userInfo) {
        groupInfo.setOwnerId(userInfo.getId());
        boardGroupService.addBoardGroup(groupInfo);
        return ResponseEntity.ok().build();
    }

    // 게시판 그룹 삭제
    @DeleteMapping("/{groupId}")
    public ResponseEntity<Void> deleteBoardGroup(@PathVariable int groupId,
                                                 @AuthenticationPrincipal UserTokenDTO userInfo) {
        if (boardGroupService.getGroupOwner(groupId).equals(userInfo.getId())) {
            boardGroupService.deleteBoardGroup(groupId);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // 게시판 그룹 수정
    @PutMapping("/{groupId}")
    public ResponseEntity<Void> updateBoardGroup(@RequestBody BoardGroupDTO groupInfo,
                                              @AuthenticationPrincipal UserTokenDTO userInfo) {
        if (boardGroupService.getGroupOwner(groupInfo.getId()).equals(userInfo.getId())) {
            boardGroupService.updateBoardGroup(groupInfo);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


    // 게시판 그룹 멤버 조회
    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<String>> getBoardGroupEmployeeList(@PathVariable int groupId) {
        return ResponseEntity.ok(boardGroupService.getGroupEmployeeList(groupId));
    }

    // 게시판 그룹 멤버 수정
    @PutMapping("/{groupId}/members")
    public ResponseEntity<Void> updateBoardGroupEmployee(@PathVariable int groupId,
                                                         @RequestBody List<String> members,
                                                         @AuthenticationPrincipal UserTokenDTO userInfo) {
        if (boardGroupService.getGroupOwner(groupId).equals(userInfo.getId())) {
            boardGroupService.updateGroupEmployee(members, groupId, userInfo.getId());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
