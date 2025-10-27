package com.kedu.ggirick_client_backend.services.workmanagement;

import com.kedu.ggirick_client_backend.dao.workmanagement.WorkPlanDAO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WorkPlanService {
    private final WorkPlanDAO workPlanDAO;
}
