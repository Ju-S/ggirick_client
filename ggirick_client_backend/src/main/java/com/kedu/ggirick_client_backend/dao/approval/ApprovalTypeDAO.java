package com.kedu.ggirick_client_backend.dao.approval;

import com.kedu.ggirick_client_backend.dto.approval.ApprovalTypeDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ApprovalTypeDAO {
    private final SqlSessionTemplate mybatis;

    public List<ApprovalTypeDTO> getTypeList() {
        return mybatis.selectList("ApprovalType.getList");
    }
}
