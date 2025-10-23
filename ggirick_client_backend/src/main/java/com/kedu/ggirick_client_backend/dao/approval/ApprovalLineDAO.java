package com.kedu.ggirick_client_backend.dao.approval;

import com.kedu.ggirick_client_backend.dto.approval.ApprovalLineDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

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
        return mybatis.selectList("ApprovalLine.getListByApprovalId", approvalId);
    }

    // 결재선 삭제(approvalId에 따라)
    public void deleteByApprovalId(int approvalId) {
        mybatis.delete("ApprovalLine.delete", approvalId);
    }

    // next_assigner와 approvalId를 가지는 결재선 조회
    public List<ApprovalLineDTO> getByNextAssignerAndApprovalId(Map<String, Object> params) {
        return mybatis.selectList("ApprovalLine.getListByNextAssignerAndApprovalId", params);
    }

    // assigner와 approvalId를 가지는 결재선 조회
    public List<ApprovalLineDTO> getByAssignerAndApprovalId(Map<String, Object> params) {
        return mybatis.selectList("ApprovalLine.getListByAssignerAndApprovalId", params);
    }
}
