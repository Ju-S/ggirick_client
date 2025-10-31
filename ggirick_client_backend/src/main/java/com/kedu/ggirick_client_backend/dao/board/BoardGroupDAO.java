package com.kedu.ggirick_client_backend.dao.board;

import com.kedu.ggirick_client_backend.dto.board.BoardGroupDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class BoardGroupDAO {
    private final SqlSessionTemplate mybatis;
    // 사용자 포함 그룹 조회
    public List<BoardGroupDTO> getGroupList(String id) {
        return mybatis.selectList("BoardGroup.getGroupList", id);
    }

    // 그룹 생성자 조회
    public String getGroupOwner(int groupId) {
        return mybatis.selectOne("BoardGroup.getGroupOwner", groupId);
    }

    // 그룹 생성(생성 후 id반환)
    public int addBoardGroup(BoardGroupDTO groupInfo) {
        mybatis.insert("BoardGroup.addBoardGroup", groupInfo);
        return groupInfo.getId();
    }

    // 그룹 삭제
    public void deleteBoardGroup(int groupId) {
        mybatis.delete("BoardGroup.deleteBoardGroup", groupId);
    }

    // 그룹 수정
    public void updateBoardGroup(BoardGroupDTO groupInfo) {
        mybatis.update("BoardGroup.updateBoardGroup", groupInfo);
    }

    // 그룹 구성원 조회
    public List<String> getGroupEmployeeList(int boardId) {
        return mybatis.selectList("BoardGroup.getGroupEmployeeList", boardId);
    }

    // 그룹 구성원 추가
    public void insertGroupEmployee(Map<String, Object> queryParams) {
        mybatis.insert("BoardGroup.insertGroupEmployee", queryParams);
    }

    // 그룹 구성원 삭제
    public void deleteGroupEmployee(Map<String, Object> queryParams) {
        mybatis.delete("BoardGroup.deleteGroupEmployee", queryParams);
    }
}
