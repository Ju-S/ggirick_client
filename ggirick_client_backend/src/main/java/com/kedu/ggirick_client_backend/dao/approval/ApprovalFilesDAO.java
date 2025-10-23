package com.kedu.ggirick_client_backend.dao.approval;

import com.kedu.ggirick_client_backend.dto.approval.ApprovalFilesDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ApprovalFilesDAO {
    private final SqlSessionTemplate mybatis;

    // 업로드하는 파일 DB저장
    public void insertFileInfo(ApprovalFilesDTO approvalFilesInfo) {
        mybatis.insert("ApprovalFiles.insert", approvalFilesInfo);
    }
}
