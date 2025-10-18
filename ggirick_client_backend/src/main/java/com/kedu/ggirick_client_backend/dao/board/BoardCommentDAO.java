package com.kedu.ggirick_client_backend.dao.board;

import com.kedu.ggirick_client_backend.dto.board.BoardCommentDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class BoardCommentDAO {
    private final SqlSessionTemplate mybatis;

    // boardId에 따른 댓글 리스트 조회
    public List<BoardCommentDTO> getList(int boardId) {
        return mybatis.selectList("BoardComment.getList", boardId);
    }

    // 원댓글에 대한 댓글 리스트 조회
    public List<BoardCommentDTO> getListByRefId(int refId) {
        return mybatis.selectList("BoardComment.getListByRefId", refId);
    }

    // UD를 위한 개별 댓글 정보 조회
    public BoardCommentDTO getById(Integer targetId) {
        return mybatis.selectOne("BoardComment.getById", targetId);
    }

    // 댓글 작성
    public void insert(BoardCommentDTO commentDTO) {
        mybatis.insert("BoardComment.insert", commentDTO);
    }

    // 댓글 삭제
    public void deleteById(int targetId) {
        mybatis.delete("BoardComment.deleteById", targetId);
    }

    // 댓글 수정
    public void updateById(BoardCommentDTO commentDTO) {
        mybatis.update("BoardComment.updateById", commentDTO);
    }
}
