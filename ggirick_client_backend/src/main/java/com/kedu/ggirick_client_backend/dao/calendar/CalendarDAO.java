package com.kedu.ggirick_client_backend.dao.calendar;

import com.kedu.ggirick_client_backend.dto.calendar.CalendarDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class CalendarDAO {
    private final SqlSessionTemplate mybatis;

    // 일정 생성
    public void insert(CalendarDTO calendarInfo) {
        mybatis.insert("Calendar.insert", calendarInfo);
    }

    // 일정 수정
    public void updateById(CalendarDTO calendarInfo) {
        mybatis.update("Calendar.updateById", calendarInfo);
    }

    // 일정 삭제
    public void deleteById(int targetId) {
        mybatis.delete("Calendar.deleteById", targetId);
    }

    // 일정 조회(개인)
    public List<CalendarDTO> getListByUserId(String userId) {
        return mybatis.selectList("Calendar.getListByUserId", userId);
    }

    // 일정 조회(그룹)
    public List<CalendarDTO> getListByGroupId(int groupId) {
        return mybatis.selectList("Calendar.getListByGroupId", groupId);
    }

    // 개별 일정 조회
    public CalendarDTO getById(int id) {
        return mybatis.selectOne("Calendar.getById", id);
    }
}
