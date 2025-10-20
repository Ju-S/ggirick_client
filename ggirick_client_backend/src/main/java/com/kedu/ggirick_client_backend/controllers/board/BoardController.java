package com.kedu.ggirick_client_backend.controllers.board;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.board.BoardCommentDTO;
import com.kedu.ggirick_client_backend.dto.board.BoardDTO;
import com.kedu.ggirick_client_backend.services.board.BoardCommentService;
import com.kedu.ggirick_client_backend.services.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.kedu.ggirick_client_backend.config.BoardConfig.ITEM_PER_PAGE;
import static com.kedu.ggirick_client_backend.config.BoardConfig.PAGE_PER_NAV;

@RestController
@RequestMapping("/board")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final BoardCommentService boardCommentService;

    private final Storage storage;

    @Value("${spring.cloud.gcp.storage.bucket}")
    private String bucketName;

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
    public ResponseEntity<Map<String, Object>> getById(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();

        BoardDTO selectedItem = boardService.getById(id);

        List<BoardCommentDTO> commentList = boardCommentService.getList(id);

        response.put("boardDetail", selectedItem);
        response.put("commentList", commentList);

        boardService.increaseViewCount(id);

        return ResponseEntity.ok(response);
    }

    // 게시글 등록
    @PostMapping
    public ResponseEntity<Void> posting(@RequestPart("boardInfo") BoardDTO dto,
                                        @RequestPart("files") List<MultipartFile> files,
                                        @AuthenticationPrincipal UserTokenDTO userInfo) throws Exception{
        dto.setWriter(userInfo.getId());
        int boardId = boardService.posting(dto);

        for(MultipartFile file:files) {
            if(!file.isEmpty()) {
                String oriName = file.getOriginalFilename();
                String sysName = UUID.randomUUID() + "_" + oriName;
                BlobInfo blobInfo =
                        BlobInfo.newBuilder(BlobId.of(bucketName, sysName))
                                .setContentType(file.getContentType())
                                .build();

                try(InputStream is = file.getInputStream()){
                    storage.createFrom(blobInfo, is);
                }
            }
        }

        return ResponseEntity.ok().build();
    }

    // 게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable int id,
                                           @AuthenticationPrincipal UserTokenDTO userInfo) {
        if (boardService.getById(id).getWriter().equals(userInfo.getId())) {
            boardService.deleteById(id);
        }

        return ResponseEntity.ok().build();
    }

    // 게시글 수정
    @PutMapping("/{id}")
    public ResponseEntity<Void> updateById(@RequestBody BoardDTO dto,
                                           @PathVariable int id,
                                           @AuthenticationPrincipal UserTokenDTO userInfo) {
        if (boardService.getById(id).getWriter().equals(userInfo.getId())) {
            dto.setId(id);
            boardService.updateById(dto);
        }

        return ResponseEntity.ok().build();
    }

    @ExceptionHandler
    public ResponseEntity<Void> error(Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
