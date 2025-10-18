package com.kedu.ggirick_client_backend.controllers.board;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.board.BoardCommentDTO;
import com.kedu.ggirick_client_backend.services.board.BoardCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/board/{boardId}/comment")
@RequiredArgsConstructor
public class BoardCommentController {

    private final BoardCommentService boardCommentService;

    // 댓글 작성(pathVariable refId가 -1인 경우에는 대댓글작성이 아닌 댓글작성. 그 외에는 대댓글 작성을 의미함)
    @PostMapping("/{refId}")
    public ResponseEntity<Void> insert(@AuthenticationPrincipal UserTokenDTO userInfo,
                                       @RequestBody BoardCommentDTO boardCommentDTO,
                                       @PathVariable int boardId,
                                       @PathVariable int refId) {
        // 대댓글 작성인 경우
        if(refId != -1){
            boardCommentDTO.setRefCommentId(refId);
        }

        boardCommentDTO.setWriter(userInfo.getId());
        boardCommentDTO.setBoardId(boardId);

        boardCommentService.insert(boardCommentDTO);
        return ResponseEntity.ok().build();
    }

    // 댓글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@AuthenticationPrincipal UserTokenDTO userInfo,
                                           @PathVariable int id) {
        if(boardCommentService.getById(id).getWriter().equals(userInfo.getId())) {
            boardCommentService.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    // 댓글 수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateById(@AuthenticationPrincipal UserTokenDTO userInfo,
                                           @RequestBody BoardCommentDTO boardCommentDTO,
                                           @PathVariable int id) {
        if(boardCommentService.getById(id).getWriter().equals(userInfo.getId())) {
            boardCommentDTO.setId(id);
            boardCommentService.updateById(boardCommentDTO);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @ExceptionHandler
    public ResponseEntity<Void> error(Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
