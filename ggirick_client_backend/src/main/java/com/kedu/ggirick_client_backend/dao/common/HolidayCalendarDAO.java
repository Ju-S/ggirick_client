package com.kedu.ggirick_client_backend.dao.common;

import com.kedu.ggirick_client_backend.dto.common.HolidayCalendarDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class HolidayCalendarDAO {

    private final SqlSessionTemplate mybatis;

    // 전체 목록
    public List<HolidayCalendarDTO> getAllHolidays() {
        return mybatis.selectList("HolidayCalendar.getAllHolidays");
    }

    // 연도별 조회
    public List<HolidayCalendarDTO> getByYear(int year) {
        return mybatis.selectList("HolidayCalendar.getByYear", year);
    }

    // 공휴일 여부 확인
    public boolean isHoliday(Date date) {
        Boolean result = mybatis.selectOne("HolidayCalendar.isHoliday", date);
        return result != null && result;
    }

    // 등록
    public void insert(HolidayCalendarDTO dto) {
        mybatis.insert("HolidayCalendar.insertHoliday", dto);
    }

    // 지정 기간 내의 공휴일 목록 조회
    public List<HolidayCalendarDTO> getHolidaysByPeriod(Map<String, Object> params) {
        return mybatis.selectList("HolidayCalendar.getHolidaysByPeriod", params);
    }
}
