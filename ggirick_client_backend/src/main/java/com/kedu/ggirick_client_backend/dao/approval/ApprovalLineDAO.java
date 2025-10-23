package com.kedu.ggirick_client_backend.dao.approval;

import com.kedu.ggirick_client_backend.dto.approval.ApprovalLineDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ApprovalLineDAO {
    private final SqlSessionTemplate mybatis;

    // 결재선 생성
    public void insert(ApprovalLineDTO approvalLineInfo) {
        mybatis.insert("ApprovalLine.insert", approvalLineInfo);
    }

    // 결재선 조회
    public List<ApprovalLineDTO> getList(int approvalId) {
        return mybatis.selectList("ApprovalLine.getList", approvalId);
    }

    // 결재선 삭제(approvalId에 따라)
    public void deleteByApprovalId(int approvalId) {
        mybatis.delete("ApprovalLine.delete", approvalId);
    }
}
