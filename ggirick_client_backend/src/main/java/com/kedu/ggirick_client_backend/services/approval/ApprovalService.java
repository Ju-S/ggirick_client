package com.kedu.ggirick_client_backend.services.approval;

import com.kedu.ggirick_client_backend.dao.approval.ApprovalDAO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApprovalService {
    private final ApprovalDAO approvalDAO;
    private final ApprovalFilesService approvalFilesService;

    // 결재 문서 목록 조회
    // 사용자가 상신한 결재문서, 승인했던 결재문서, 반려했던 결재문서, 승인했지만 위에서 반려당한 결재문서, 결재해야할 문서를 조회
    public List<ApprovalDTO> getList(String userId) {
        return approvalDAO.getList(userId);
    }

    // 개별 문서 조회
    public ApprovalDTO getById(int approvalId) {
        return approvalDAO.getById(approvalId);
    }

    // 결재 문서 기안
    // 파일 업로드 포함
    public void insert(ApprovalDTO approvalInfo, List<MultipartFile> files) throws Exception {
        int approvalId = approvalDAO.insert(approvalInfo);
        if(files != null) {
            approvalFilesService.insertFileInfo(files, approvalId);
        }
    }

    // 결재 문서 수정
    public void update(ApprovalDTO approvalInfo, List<MultipartFile> files) throws Exception {
        approvalDAO.update(approvalInfo);
        if(files != null) {
            approvalFilesService.insertFileInfo(files, approvalInfo.getId());
        }
    }

    // 결재 문서 삭제
    public void delete(int approvalId) {
        approvalDAO.delete(approvalId);
    }
}
