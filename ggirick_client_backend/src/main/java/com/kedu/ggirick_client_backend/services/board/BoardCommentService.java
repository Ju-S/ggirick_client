package com.kedu.ggirick_client_backend.services.board;

import com.kedu.ggirick_client_backend.dao.board.BoardCommentDAO;
import com.kedu.ggirick_client_backend.dto.board.BoardCommentDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardCommentService {
    private final BoardCommentDAO boardCommentDAO;

    // boardId에 따른 댓글 리스트 조회
    public List<BoardCommentDTO> getList(int boardId) {
        return boardCommentDAO.getList(boardId);
    }

    // 개별 댓글 정보 조회(UD용)
    public BoardCommentDTO getById(Integer targetId) {
        return boardCommentDAO.getById(targetId);
    }

    // 댓글 작성
    public void insert(BoardCommentDTO commentDTO) {
        boardCommentDAO.insert(commentDTO);
    }

    // 댓글 삭제
    // 대댓글이 있는 경우에는 삭제를 보류하고 contents를 "삭제된 댓글"상태로 변경
    // 대댓글의 삭제일때 원댓글이 "삭제된 댓글"상태인 경우 원댓글도 함께 삭제
    public void deleteById(int targetId) {
        BoardCommentDTO originalComment = getById(targetId);
        List<BoardCommentDTO> refCommentList = boardCommentDAO.getListByRefId(targetId);

        // deletedGgirickBoardComment를 base64인코딩하여 UI에 적용할 내용으로 변경.
        // 일반 사용자가 삭제된 댓글입니다. 라고 적었을때 UI가 변경되는것을 방지.
        String deletedContents = "ZGVsZXRlZEdnaXJpY2tCb2FyZENvbW1lbnQ=";

        if (refCommentList.isEmpty()) {
            boardCommentDAO.deleteById(targetId);

            // 만약 원댓글 아래로 댓글이 삭제된 댓글이 존재한다면 삭제
            // 아래에 얼마나 많은 댓글이 존재하는지 모르기 때문에 재귀호출
            BoardCommentDTO refComment = getById(originalComment.getRefCommentId());
            if (refComment != null) {
                if (refComment.getContents().equals(deletedContents)) {
                    deleteById(refComment.getId());
                }
            }
        } else {
            originalComment.setContents(deletedContents);
            updateById(originalComment);
        }
    }

    // 댓글 수정
    public void updateById(BoardCommentDTO commentDTO) {
        boardCommentDAO.updateById(commentDTO);
    }
}
