package com.kedu.ggirick_client_backend.dao.approval;

import com.kedu.ggirick_client_backend.dto.approval.ApprovalDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class ApprovalDAO {
    private final SqlSessionTemplate mybatis;

    // 결재 문서 목록 조회
    // 사용자가 상신한 결재문서, 승인했던 결재문서, 반려했던 결재문서, 승인했지만 위에서 반려당한 결재문서, 결재해야할 문서를 조회
    public List<ApprovalDTO> getList(Map<String, Object> params) {
        return mybatis.selectList("Approval.getList", params);
    }

    public int getTotalPage(Map<String, Object> params) {
        return mybatis.selectOne("Approval.getTotalPage", params);
    }

    // 결재 문서 개별 조회
    public ApprovalDTO getById(int approvalId) {
        return mybatis.selectOne("Approval.getById", approvalId);
    }

    // 결재 문서 기안
    // 파일 업로드를 위한 id값 반환
    public int insert(ApprovalDTO approvalInfo) {
        mybatis.insert("Approval.insert", approvalInfo);
        return approvalInfo.getId();
    }

    // 결재 문서 수정
    public void update(ApprovalDTO approvalInfo) {
        mybatis.update("Approval.update", approvalInfo);
    }

    // 결재 문서 상태 수정
    public void updateType(Map<String, Object> params) {
        mybatis.update("Approval.updateType", params);
    }

    // 결재 문서 삭제
    public void delete(int approvalId) {
        mybatis.delete("Approval.delete", approvalId);
    }

    // 특정 직원 승인된 문서 가져오기 (문서 종류별)
    public List<ApprovalDTO> getApprovedDocs(String employeeId, String docTypeCode) {
        Map<String, Object> params = new HashMap<>();
        params.put("employeeId", employeeId);
        params.put("docTypeCode", docTypeCode);
        return mybatis.selectList("Approval.getApprovedDocs", params);
    }
}
