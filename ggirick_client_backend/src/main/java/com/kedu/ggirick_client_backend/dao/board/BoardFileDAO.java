package com.kedu.ggirick_client_backend.dao.board;

import com.kedu.ggirick_client_backend.dto.board.BoardFileDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class BoardFileDAO {
    private final SqlSessionTemplate mybatis;

    // 파일 업로드
    public void insertFileInfo(BoardFileDTO fileInfo) {
        mybatis.insert("BoardFile.insert", fileInfo);
    }

    // 파일 리스트 조회
    public List<BoardFileDTO> getFileList(int boardId) {
        return mybatis.selectList("BoardFile.getListByBoardId", boardId);
    }

    // 파일 삭제

}
