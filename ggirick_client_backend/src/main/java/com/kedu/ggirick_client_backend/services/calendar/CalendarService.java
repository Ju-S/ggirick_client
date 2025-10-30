package com.kedu.ggirick_client_backend.services.calendar;

import com.kedu.ggirick_client_backend.dao.calendar.CalendarDAO;
import com.kedu.ggirick_client_backend.dto.calendar.CalendarDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CalendarService {
    private final CalendarDAO calendarDAO;

    // 일정 생성
    public void insert(CalendarDTO calendarInfo) {
        if(calendarInfo.getColor() == null || calendarInfo.getColor().isEmpty()) {
            calendarInfo.setColor("default");
        }
        calendarDAO.insert(calendarInfo);
    }

    // 일정 수정
    public void updateById(CalendarDTO calendarInfo) {
        calendarDAO.updateById(calendarInfo);
    }

    // 일정 삭제
    public void deleteById(int targetId) {
        calendarDAO.deleteById(targetId);
    }

    // 일정 조회(개인)
    public List<CalendarDTO> getListByUserId(String userId) {
        return calendarDAO.getListByUserId(userId);
    }

    // 일정 조회(그룹)
    public List<CalendarDTO> getListByGroupId(int groupId) {
        return calendarDAO.getListByGroupId(groupId);
    }

    // 개별 일정 조회
    public CalendarDTO getById(int id) {
        return calendarDAO.getById(id);
    }
}
