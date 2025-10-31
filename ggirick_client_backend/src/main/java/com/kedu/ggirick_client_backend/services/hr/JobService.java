package com.kedu.ggirick_client_backend.services.hr;

import com.kedu.ggirick_client_backend.dao.hr.JobDAO;
import com.kedu.ggirick_client_backend.dto.hr.JobDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {
    private final JobDAO jobDAO;

    // 직급 목록 조회 ( 메타 데이터 조회용 )
    public List<JobDTO> getAllJobs() {
        return jobDAO.getAllJobs();
    }
}
