package com.kedu.ggirick_client_backend.dao.approval;

import com.kedu.ggirick_client_backend.dto.approval.ApprovalDelegateDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class ApprovalDelegateDAO {
    private final SqlSessionTemplate mybatis;

    // 사용자 아이디에 따른 대리결재 해야할 결재자 id 조회
    public List<String> getAssignerByDelegator(String userId) {
        return mybatis.selectList("ApprovalDelegate.getListByDelegator", userId);
    }

    // 대리결재자 등록
    public void insert(ApprovalDelegateDTO params) {
        mybatis.insert("ApprovalDelegate.insert", params);
    }
}
