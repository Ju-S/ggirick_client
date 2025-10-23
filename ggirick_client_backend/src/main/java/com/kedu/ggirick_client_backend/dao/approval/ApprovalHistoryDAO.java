package com.kedu.ggirick_client_backend.dao.approval;

import com.kedu.ggirick_client_backend.dto.approval.ApprovalHistoryDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class ApprovalHistoryDAO {
    private final SqlSessionTemplate mybatis;

    // 결재 기록 insert
    public void insert(ApprovalHistoryDTO approvalHistoryInfo) {
        mybatis.insert("ApprovalHistory.insert", approvalHistoryInfo);
    }

    // 결재 기록 목록 조회
    public List<ApprovalHistoryDTO> getListByApprovalId(int approvalId) {
        return mybatis.selectList("ApprovalHistory.getListByApprovalId", approvalId);
    }

    // 결재 기록 조회
    public ApprovalHistoryDTO getByAssignerAndApprovalId(Map<String, Object> params) {
        return mybatis.selectOne("ApprovalHistory.getByAssignerAndApprovalId", params);
    }

    // 결재 기록 취소(삭제)
    public void deleteByApprovalIdAndAssigner(Map<String, Object> params) {
        mybatis.delete("ApprovalHistory.deleteByApprovalIdAndAssigner", params);
    }
}
