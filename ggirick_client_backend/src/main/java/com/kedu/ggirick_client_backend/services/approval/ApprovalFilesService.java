package com.kedu.ggirick_client_backend.services.approval;

import com.kedu.ggirick_client_backend.dao.approval.ApprovalFilesDAO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalFilesDTO;
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
                String sysName = fileUtil.fileUpload(oriName, "approval/" + approvalId + "/", file);

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

    // approvalId에 따른 파일 목록 조회
    public List<ApprovalFilesDTO> getListByApprovalId(int approvalId) {
        return approvalFilesDAO.getListByApprovalId(approvalId);
    }

    // 파일 개별 조회
    public ApprovalFilesDTO getFileById(int id) {
        return approvalFilesDAO.getFileById(id);
    }

    // 파일 다운로드
    public byte[] downloadFile(String sysName) {
        return fileUtil.fileDownload(sysName);
    }


    // fileId에 따른 폴더 삭제
    public void deleteFile(ApprovalFilesDTO fileInfo) {
        approvalFilesDAO.delete(fileInfo.getId());
        fileUtil.deleteFile(fileInfo.getUrl());
    }

    // approvalId에 따른 폴더 삭제
    public void deleteByApprovalId(int approvalId) {
        for (ApprovalFilesDTO file : getListByApprovalId(approvalId)) {
            deleteFile(file);
        }
    }
}
