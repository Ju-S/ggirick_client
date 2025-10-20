package com.kedu.ggirick_client_backend.dao.common;

import com.kedu.ggirick_client_backend.dto.common.DepartmentDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class DepartmentDAO {
    private final SqlSessionTemplate mybatis;

    // 부서 목록 조회 ( 메타 데이터 조회용 )
    public List<DepartmentDTO> getAllDepartments() {
        return mybatis.selectList("hr-metadata.getAllDepartments");
    }

    // ----------- 매퍼 생성 안 함. 사용하려며 매퍼 생성해야 됨 ! -------------------
    // 부서 코드 -> 부서명 찾기
    public String findDepartmentName(String code) {
        return mybatis.selectOne("hr-metadata.findDepartmentName", code);
    }
}
