package com.kedu.ggirick_client_backend.services.common;

import com.kedu.ggirick_client_backend.dao.common.HolidayCalendarDAO;
import com.kedu.ggirick_client_backend.dto.common.HolidayCalendarDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class HolidayCalendarService {

    private final HolidayCalendarDAO holidayCalendarDAO;

    // 전체 공휴일 조회
    public List<HolidayCalendarDTO> getAllHolidays() {
        return holidayCalendarDAO.getAllHolidays();
    }

    // 연도별 공휴일 조회
    public List<HolidayCalendarDTO> getHolidaysByYear(int year) {
        return holidayCalendarDAO.getByYear(year);
    }

    // 특정 날짜가 휴일인지 확인
    public boolean isHoliday(Date date) {
        return holidayCalendarDAO.isHoliday(date);
    }

    // 공휴일 등록
    public void addHoliday(HolidayCalendarDTO dto) {
        log.info("📅 공휴일 등록: {} ({})", dto.getCalDate(), dto.getDescription());
        holidayCalendarDAO.insert(dto);
    }

    // 지정 기간 내의 공휴일 목록 조회
    public List<HolidayCalendarDTO> getHolidaysByPeriod(LocalDate start, LocalDate end) {
        Map<String, Object> params = new HashMap<>();
        params.put("startDate", Date.valueOf(start));
        params.put("endDate", Date.valueOf(end));
        return holidayCalendarDAO.getHolidaysByPeriod(params);
    }
}
