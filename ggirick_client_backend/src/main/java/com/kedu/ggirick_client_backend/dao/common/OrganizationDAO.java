package com.kedu.ggirick_client_backend.dao.common;

import com.kedu.ggirick_client_backend.dto.common.OrganizationDTO;
import com.kedu.ggirick_client_backend.dto.employee.OrganizationWithDepartmentsDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class OrganizationDAO {
    private final SqlSessionTemplate mybatis;

    // 조직 목록 조회 ( 메타 데이터 조회용 )
    public List<OrganizationDTO> getAllOrganizations() {
        return mybatis.selectList("hr-metadata.getAllOrganizations");
    }

    // ----------- 매퍼 생성 안 함. 사용하려며 매퍼 생성해야 됨 ! -------------------
    // 조직 코드 -> 조직명 찾기
    public String findOrganizationName(String code) {
        return mybatis.selectOne("hr.organization.findOrganizationName", code);
    }

    //전체 조직도 가져오기
    public List<OrganizationWithDepartmentsDTO> findOrganizationStructure() {
        return mybatis.selectList("hr-metadata.findOrganizationStructure");
    }
}
