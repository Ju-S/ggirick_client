package com.kedu.ggirick_client_backend.services.approval;

import com.kedu.ggirick_client_backend.dao.approval.ApprovalFilesDAO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalFilesDTO;
import com.kedu.ggirick_client_backend.dto.board.BoardFileDTO;
import com.kedu.ggirick_client_backend.utils.FileUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApprovalFilesService {
    private final ApprovalFilesDAO approvalFilesDAO;
    private final FileUtil fileUtil;

    // 파일 업로드시, DB저장
    public void insertFileInfo(List<MultipartFile> files, int approvalId) throws Exception {
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                String oriName = file.getOriginalFilename();
                String sysName = fileUtil.fileUpload(oriName, "/approval/" + approvalId + "/", file);

                approvalFilesDAO.insertFileInfo(
                        ApprovalFilesDTO
                                .builder()
                                .name(oriName)
                                .url(sysName)
                                .approvalId(approvalId)
                                .build()
                );
            }
        }
    }
}
