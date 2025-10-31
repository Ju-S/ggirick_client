package com.kedu.ggirick_client_backend.services.workmanagement;

import com.kedu.ggirick_client_backend.dao.workmanagement.WorkTimeTypeDAO;
import com.kedu.ggirick_client_backend.dto.workmanagement.WorkTimeTypeDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkTimeTypeService {
    private final WorkTimeTypeDAO workTimeTypedao;

    // 근무현황 기록용 유형 목록 가져오기
    public List<WorkTimeTypeDTO> getAllWorkTimeTypes() {
        return workTimeTypedao.getAllWorkTimeTypes();
    }
}
