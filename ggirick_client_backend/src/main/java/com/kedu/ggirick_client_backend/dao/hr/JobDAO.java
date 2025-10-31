package com.kedu.ggirick_client_backend.dao.hr;


import com.kedu.ggirick_client_backend.dto.hr.JobDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class JobDAO {
    private final SqlSessionTemplate mybatis;

    // 직급 목록 조회 ( 메타 데이터 조회용 )
    public List<JobDTO> getAllJobs() {
        return mybatis.selectList("HrMetadata.getAllJobs");
    }

    // 직급 코드 -> 직급명 찾기
    public String findJobName(String code) {
        return mybatis.selectOne("Job.findJobName", code);
    }

    // ID로 직급 조회
    public String getJobCodeById(String empId) {
        return mybatis.selectOne("Job.getJobCodeById", empId);
    }
}
