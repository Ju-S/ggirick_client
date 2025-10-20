package com.kedu.ggirick_client_backend.services.board;

import com.kedu.ggirick_client_backend.dao.board.BoardGroupDAO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BoardGroupService {
    private final BoardGroupDAO boardGroupDAO;


}
