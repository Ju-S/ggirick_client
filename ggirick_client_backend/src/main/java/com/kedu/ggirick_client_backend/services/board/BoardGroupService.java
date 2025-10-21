package com.kedu.ggirick_client_backend.services.board;

import com.kedu.ggirick_client_backend.dao.board.BoardGroupDAO;
import com.kedu.ggirick_client_backend.dto.board.BoardGroupDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardGroupService {
    private final BoardGroupDAO boardGroupDAO;

    public List<BoardGroupDTO> getGroupList(String id) {
        return boardGroupDAO.getGroupList(id);
    }
}
