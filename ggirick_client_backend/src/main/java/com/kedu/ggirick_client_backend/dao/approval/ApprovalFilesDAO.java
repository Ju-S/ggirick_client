package com.kedu.ggirick_client_backend.dao.approval;

import com.kedu.ggirick_client_backend.dto.approval.ApprovalFilesDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ApprovalFilesDAO {
    private final SqlSessionTemplate mybatis;

    // 업로드하는 파일 DB저장
    public void insertFileInfo(ApprovalFilesDTO approvalFilesInfo) {
        mybatis.insert("ApprovalFiles.insert", approvalFilesInfo);
    }

    // 파일 목록 조회
    public List<ApprovalFilesDTO> getListByApprovalId(int approvalId) {
        return mybatis.selectList("ApprovalFiles.getListByApprovalId", approvalId);
    }
}
