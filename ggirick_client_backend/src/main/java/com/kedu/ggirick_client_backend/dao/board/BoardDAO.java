package com.kedu.ggirick_client_backend.dao.board;

import com.kedu.ggirick_client_backend.dto.board.BoardDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class BoardDAO {

    private final SqlSessionTemplate mybatis;

    // 게시글 목록 조회
    // searchParams는 to, from을 필수로 가지고 searchQuery, searchFilter를 선택적으로 가진다.
    public List<BoardDTO> getList(Map<String, Object> searchParams) {
        return mybatis.selectList("Board.getList", searchParams);
    }

    // 공지글 목록 조회
    public List<BoardDTO> getNotificationList(int groupId) {
        return mybatis.selectList("Board.getNotificationList", groupId);
    }

    // 단일 게시글 조회
    public BoardDTO getById(int targetId) {
        return mybatis.selectOne("Board.getById", targetId);
    }

    // 게시물 총 갯수 return
    public int getBoardCount(Map<String, Object> searchParams) {
        return mybatis.selectOne("Board.getBoardCount", searchParams);
    }

    // 게시글 등록(등록 후, 등록된 board의 ID 반환)
    public int posting(BoardDTO dto) {
        mybatis.insert("Board.posting", dto);
        return dto.getId();
    }

    // 게시글 삭제
    public void deleteById(int targetId) {
        mybatis.delete("Board.deleteById", targetId);
    }

    // 게시글 수정
    public void updateById(BoardDTO dto) {
        mybatis.update("Board.updateById", dto);
    }

    // 게시글 조회수 증가
    public void increaseViewCount(int targetId) {
        mybatis.update("Board.increaseViewCount", targetId);
    }
}
