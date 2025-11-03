package com.kedu.ggirick_client_backend.services.workmanagement;

import com.kedu.ggirick_client_backend.dao.workmanagement.WorkAttendanceSummaryDAO;
import com.kedu.ggirick_client_backend.dto.workmanagement.WorkAttendanceSummaryDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WorkAttendanceSummaryService {
    private final WorkAttendanceSummaryDAO workAttendanceSummaryDAO;

    public int mergeWorkAttendanceSummary(WorkAttendanceSummaryDTO dto) {
        return workAttendanceSummaryDAO.mergeWorkAttendanceSummary(dto);
    }
}
