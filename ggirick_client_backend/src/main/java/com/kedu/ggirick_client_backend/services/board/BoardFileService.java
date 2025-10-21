package com.kedu.ggirick_client_backend.services.board;

import com.kedu.ggirick_client_backend.dao.board.BoardFileDAO;
import com.kedu.ggirick_client_backend.dto.board.BoardFileDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardFileService {
    private final BoardFileDAO boardFileDAO;

    // 파일 업로드시, DB저장
    public void insertFileInfo(BoardFileDTO fileInfo) {
        boardFileDAO.insertFileInfo(fileInfo);
    }

    // 게시판 파일 리스트 조회
    public List<BoardFileDTO> getFileList(int boardId) {
        return boardFileDAO.getFileList(boardId);
    }
}
