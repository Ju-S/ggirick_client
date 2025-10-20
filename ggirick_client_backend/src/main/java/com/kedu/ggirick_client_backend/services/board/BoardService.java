package com.kedu.ggirick_client_backend.services.board;

import com.kedu.ggirick_client_backend.dao.board.BoardDAO;
import com.kedu.ggirick_client_backend.dto.board.BoardDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.kedu.ggirick_client_backend.config.BoardConfig.ITEM_PER_PAGE;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardDAO boardDAO;

    // 페이지에 해당하는 게시글 목록 조회
    public List<BoardDTO> getList(int curPage, String searchQuery) {
        Map<String, Object> searchParams = new HashMap<>();

        int from = ITEM_PER_PAGE * (curPage - 1) + 1;
        int to = from + ITEM_PER_PAGE - 1;

        searchParams.put("from", from);
        searchParams.put("to", to);

        searchParams.put("boardGroupId", 1);

        searchParams.put("searchQuery", searchQuery);

        return boardDAO.getList(searchParams);
    }

    // 선택된 게시글의 내용 select
    public BoardDTO getById(int targetId) {
        return boardDAO.getById(targetId);
    }

    // 게시글의 최대 페이지 수 확인
    public int getTotalPage(String searchQuery) {
        Map<String, Object> searchParams = new HashMap<>();

        searchParams.put("boardGroupId", 1);
        searchParams.put("searchQuery", searchQuery);

        return boardDAO.getBoardCount(searchParams) / ITEM_PER_PAGE;
    }

    // 게시글 등록(등록 후, 로그인된 아이디(작성자ID) 반환)
    public int posting(BoardDTO dto) {
        return boardDAO.posting(dto);
    }

    // 게시글 삭제
    public void deleteById(int targetId) {
        boardDAO.deleteById(targetId);
    }

    // 게시글 수정
    public void updateById(BoardDTO dto) {
        boardDAO.updateById(dto);
    }

    // 게시글 조회수 증가
    public void increaseViewCount(int targetId) {
        boardDAO.increaseViewCount(targetId);
    }
}
