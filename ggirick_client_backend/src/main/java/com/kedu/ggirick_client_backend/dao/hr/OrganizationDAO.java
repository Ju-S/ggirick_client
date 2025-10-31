package com.kedu.ggirick_client_backend.dao.hr;

import com.kedu.ggirick_client_backend.dto.hr.OrganizationDTO;
import com.kedu.ggirick_client_backend.dto.hr.OrganizationWithDepartmentsDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class OrganizationDAO {
    private final SqlSessionTemplate mybatis;

    // 조직 목록 조회 ( 메타 데이터 조회용 )
    public List<OrganizationDTO> getAllOrganizations() {
        return mybatis.selectList("HrMetadata.getAllOrganizations");
    }

    // 조직 코드 -> 조직명 찾기
    public String findOrganizationName(String code) {
        return mybatis.selectOne("Organization.findOrganizationName", code);
    }

    // 전체 조직도 가져오기
    public List<OrganizationWithDepartmentsDTO> findOrganizationStructure() {
        return mybatis.selectList("HrMetadata.findOrganizationStructure");
    }
}
