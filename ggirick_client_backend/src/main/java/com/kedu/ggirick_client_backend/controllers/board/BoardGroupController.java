package com.kedu.ggirick_client_backend.controllers.board;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.board.BoardGroupDTO;
import com.kedu.ggirick_client_backend.services.board.BoardGroupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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


    // 게시판 그룹 삭제


    // 게시판 그룹 수정


    // 게시판 그룹 멤버 추가


    // 게시판 그룹 멤버 수정


    // 게시판 그룹 멤버 삭제

}
