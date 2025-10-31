package com.kedu.ggirick_client_backend.dao.workmanagement;

import com.kedu.ggirick_client_backend.dto.workmanagement.WorkTimeTypeDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class WorkTimeTypeDAO {
    private final SqlSessionTemplate mybatis;

    // 근무현황 기록용 유형 목록 가져오기
    public List<WorkTimeTypeDTO> getAllWorkTimeTypes() {
        return mybatis.selectList("WorkTimeType.getAllWorkTimeTypes");
    }

}
