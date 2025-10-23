package com.kedu.ggirick_client_backend.services.approval;

import com.kedu.ggirick_client_backend.dao.approval.ApprovalDAO;
import com.kedu.ggirick_client_backend.dto.approval.ApprovalDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ApprovalService {
    private final ApprovalDAO approvalDAO;

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
    public int insert(ApprovalDTO approvalInfo) throws Exception {
        return approvalDAO.insert(approvalInfo);
    }

    // 결재 문서 수정
    public void update(ApprovalDTO approvalInfo) throws Exception {
        approvalDAO.update(approvalInfo);
    }

    // 결재 문서 상태 수정
    public void updateType(int typeId, int approvalId) {
        Map<String, Object> params = new HashMap<>();

        params.put("typeId", typeId);
        params.put("id", approvalId);

        approvalDAO.updateType(params);
    }

    // 결재 문서 삭제
    public void delete(int approvalId) {
        approvalDAO.delete(approvalId);
    }
}
