package com.kedu.ggirick_client_backend.controllers;

import com.kedu.ggirick_client_backend.config.BoardConfig;
import com.kedu.ggirick_client_backend.dto.board.BoardDTO;
import com.kedu.ggirick_client_backend.services.board.BoardService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.kedu.ggirick_client_backend.config.BoardConfig.ITEM_PER_PAGE;
import static com.kedu.ggirick_client_backend.config.BoardConfig.PAGE_PER_NAV;

@RestController
@RequestMapping("/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    // 게시글 목록 조회
    @GetMapping
    public ResponseEntity<Map<String, Object>> getList(@RequestParam(defaultValue = "1") int currentPage,
                                                       @RequestParam(defaultValue = "", required = false) String searchQuery) {
        Map<String, Object> response = new HashMap<>();

        List<BoardDTO> boardList = boardService.getList(currentPage, searchQuery);
        long totalPage = boardService.getTotalPage(searchQuery);

        response.put("boardList", boardList);
        response.put("itemPerPage", ITEM_PER_PAGE);
        response.put("pagePerNav", PAGE_PER_NAV);
        response.put("totalPage", totalPage);

        return ResponseEntity.ok(response);
    }

    // 단일 게시글 조회
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(@PathVariable long id) {
        Map<String, Object> response = new HashMap<>();

        BoardDTO selectedItem = boardService.getById(id);
//        List<ReplyDTO> replyList = replyService.getList(id);

        response.put("boardDetail", selectedItem);
//        response.put("replyList", replyList);

        return ResponseEntity.ok(response);
    }

    // 게시글 등록
    @PostMapping
    public ResponseEntity<Void> posting(@RequestBody BoardDTO dto,
                                        HttpSession session) {
        String loginId = (String) session.getAttribute("loginId");

        if (loginId != null) {
            dto.setWriter(loginId);
            boardService.posting(dto);
        }

        return ResponseEntity.ok().build();
    }

    // 게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable long id,
                                           HttpSession session) {
        String loginId = (String) session.getAttribute("loginId");

        if (loginId != null) {
            if (boardService.getById(id).getWriter().equals(loginId)) {
                boardService.deleteById(id);
            }
        }

        return ResponseEntity.ok().build();
    }

    // 게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateById(@RequestBody BoardDTO dto,
                                           @PathVariable long id,
                                           HttpSession session) {
        String loginId = (String) session.getAttribute("loginId");

        if (loginId != null) {
            if (boardService.getById(dto.getId()).getWriter().equals(loginId)) {
                boardService.updateById(dto);
            }
        }

        return ResponseEntity.ok().build();
    }

    @ExceptionHandler
    public ResponseEntity<Void> error(Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
