package com.kedu.ggirick_client_backend.services.board;

import com.kedu.ggirick_client_backend.dao.board.BoardGroupDAO;
import com.kedu.ggirick_client_backend.dto.board.BoardGroupDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BoardGroupService {
    private final BoardGroupDAO boardGroupDAO;

    public List<BoardGroupDTO> getGroupList(String id) {
        return boardGroupDAO.getGroupList(id);
    }

    public List<String> getGroupEmployeeList(int boardId) {
        return boardGroupDAO.getGroupEmployeeList(boardId);
    }

    public String getGroupOwner(int groupId) {
        return boardGroupDAO.getGroupOwner(groupId);
    }

    public void updateGroupEmployee(List<String> members, int boardId, String ownerId) {
        // 없던 멤버 추가
        for (String member : members) {
            if(!getGroupEmployeeList(boardId).contains(member) && !member.equals(ownerId)) {
                Map<String, Object> params = new HashMap<>();
                params.put("boardId", boardId);
                params.put("userId", member);
                boardGroupDAO.insertGroupEmployee(params);
            }
        }

        // 있던 멤버 삭제
        for (String existedMember : getGroupEmployeeList(boardId)) {
            if(!members.contains(existedMember) && !existedMember.equals(ownerId)) {
                Map<String, Object> params = new HashMap<>();
                params.put("boardId", boardId);
                params.put("userId", existedMember);
                boardGroupDAO.deleteGroupEmployee(params);
            }
        }
    }

    public void addBoardGroup(BoardGroupDTO groupInfo) {
        int groupId = boardGroupDAO.addBoardGroup(groupInfo);

        Map<String, Object> params = new HashMap<>();

        params.put("boardId", groupId);
        params.put("userId", groupInfo.getOwnerId());

        boardGroupDAO.insertGroupEmployee(params);
    }

    public void deleteBoardGroup(int groupId) {
        boardGroupDAO.deleteBoardGroup(groupId);
    }

    public void updateBoardGroup(BoardGroupDTO groupInfo) {
        boardGroupDAO.updateBoardGroup(groupInfo);
    }
}
