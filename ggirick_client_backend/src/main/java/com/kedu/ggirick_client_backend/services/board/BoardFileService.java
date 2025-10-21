package com.kedu.ggirick_client_backend.services.board;

import com.kedu.ggirick_client_backend.dao.board.BoardFileDAO;
import com.kedu.ggirick_client_backend.dto.board.BoardFileDTO;
import com.kedu.ggirick_client_backend.utils.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardFileService {
    private final BoardFileDAO boardFileDAO;
    private final FileUtil fileUtil;

    // 파일 업로드시, DB저장
    public void insertFileInfo(List<MultipartFile> files, int boardId) throws Exception {
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String oriName = file.getOriginalFilename();
                String sysName = fileUtil.fileUpload(oriName, file);

                boardFileDAO.insertFileInfo(
                        BoardFileDTO
                                .builder()
                                .name(oriName)
                                .url(sysName)
                                .boardId(boardId)
                                .build()
                );
            }
        }
    }

    // 파일 다운로드
    public byte[] downloadFile(String sysName) {
        return fileUtil.fileDownload(sysName);
    }

    // 게시판 파일 리스트 조회
    public List<BoardFileDTO> getFileList(int boardId) {
        return boardFileDAO.getFileList(boardId);
    }
}
