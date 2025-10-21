package com.kedu.ggirick_client_backend.dao.board;

import com.kedu.ggirick_client_backend.dto.board.BoardGroupDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class BoardGroupDAO {
    private final SqlSessionTemplate mybatis;
    // 사용자 포함 그룹 조회
    public List<BoardGroupDTO> getGroupList(String id) {
        return mybatis.selectList("BoardGroup.getGroupList", id);
    }

    // 그룹 생성

    // 그룹 삭제

    // 그룹 수정

    // 그룹 구성원 추가

    // 그룹 구성원 삭제

}
