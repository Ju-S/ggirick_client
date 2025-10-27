package com.kedu.ggirick_client_backend.dao.approval;

import com.kedu.ggirick_client_backend.dto.approval.ApprovalDocTypeDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ApprovalDocTypeDAO {
    private final SqlSessionTemplate mybatis;

    public List<ApprovalDocTypeDTO> getDocTypeList() {
        return mybatis.selectList("ApprovalDocType.getList");
    }
}
