package com.kedu.ggirick_client_backend.dao.hr;

import com.kedu.ggirick_client_backend.dto.hr.DepartmentDTO;
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
        return mybatis.selectList("HrMetadata.getAllDepartments");
    }

    // 부서 코드 -> 부서명 찾기
    public String findDepartmentName(String code) {
        return mybatis.selectOne("Department.findDepartmentName", code);
    }
}
