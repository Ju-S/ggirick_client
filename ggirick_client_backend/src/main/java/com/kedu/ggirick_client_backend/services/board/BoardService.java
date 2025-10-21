package com.kedu.ggirick_client_backend.services.board;

import com.kedu.ggirick_client_backend.dao.board.BoardDAO;
import com.kedu.ggirick_client_backend.dto.board.BoardDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.kedu.ggirick_client_backend.config.BoardConfig.ITEM_PER_PAGE;
import static com.kedu.ggirick_client_backend.config.BoardConfig.NOTIFICATION_PER_PAGE;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardDAO boardDAO;
    private final BoardFileService boardFileService;

    // 페이지에 해당하는 게시글 목록 조회
    public List<BoardDTO> getList(int curPage, int groupId, int searchFilter, String searchQuery) {
        Map<String, Object> searchParams = new HashMap<>();

        // 공지글 갯수에 따라 불러오는 게시글 양 조절
        int itemPerPage = getItemPerPage(groupId);

        int from = itemPerPage * (curPage - 1) + 1;
        int to = from + itemPerPage - 1;

        searchParams.put("from", from);
        searchParams.put("to", to);

        searchParams.put("boardGroupId", groupId);

        searchParams.put("searchFilter", searchFilter);
        searchParams.put("searchQuery", searchQuery);

        return boardDAO.getList(searchParams);
    }

    // 공지글 목록 조회
    public List<BoardDTO> getNotificationList(int groupId) {
        return boardDAO.getNotificationList(groupId);
    }

    // 공지글 갯수에 따른 페이지별 item수 조절
    public int getItemPerPage(int groupId) {
        // 공지글 갯수에 따라 불러오는 게시글 양 조절
        int notificationLength = getNotificationList(groupId).size();
        int itemPerPage = ITEM_PER_PAGE - notificationLength;
        if(notificationLength > NOTIFICATION_PER_PAGE) itemPerPage = ITEM_PER_PAGE - NOTIFICATION_PER_PAGE;
        return itemPerPage;
    }

    // 선택된 게시글의 내용 select
    public BoardDTO getById(int targetId) {
        return boardDAO.getById(targetId);
    }

    // 게시글의 최대 페이지 수 확인
    public int getTotalPage(int groupId, int searchFilter, String searchQuery) {
        Map<String, Object> searchParams = new HashMap<>();

        searchParams.put("boardGroupId", groupId);
        searchParams.put("searchFilter", searchFilter);
        searchParams.put("searchQuery", searchQuery);

        int itemPerPage = getItemPerPage(groupId);

        return boardDAO.getBoardCount(searchParams) / itemPerPage + 1;
    }

    // 게시글 등록(등록 후, 로그인된 아이디(작성자ID) 반환)
    @Transactional
    public void posting(BoardDTO dto, List<MultipartFile> files) throws Exception {
        int boardId = boardDAO.posting(dto);
        if(files != null) {
            boardFileService.insertFileInfo(files, boardId);
        }
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
