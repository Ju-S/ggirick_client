package com.kedu.ggirick_client_backend.dao.calendar;

import com.kedu.ggirick_client_backend.dto.calendar.CalendarGroupDTO;
import lombok.RequiredArgsConstructor;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class CalendarGroupDAO {
    private final SqlSessionTemplate mybatis;

    // 그룹 생성
    public int insert(CalendarGroupDTO calendarGroupInfo) {
        mybatis.insert("CalendarGroup.insert", calendarGroupInfo);
        return calendarGroupInfo.getId();
    }

    // 그룹 수정
    public void updateById(CalendarGroupDTO calendarGroupInfo) {
        mybatis.update("CalendarGroup.updateById", calendarGroupInfo);
    }

    // 그룹 삭제
    public void delete(int targetId) {
        mybatis.delete("CalendarGroup.deleteById", targetId);
    }

    // 사용자 그룹 목록 조회
    public List<CalendarGroupDTO> getListByUserId(String userId) {
        return mybatis.selectList("CalendarGroup.getListByUserId", userId);
    }

    // 그룹 내 사용자 목록 조회
    public List<String> getEmployeeListByGroupId(int groupId) {
        return mybatis.selectList("CalendarGroup.getEmployeeListByGroupId", groupId);
    }

    // 그룹 owner 조회
    public String getOwnerById(int groupId) {
        return mybatis.selectOne("CalendarGroup.getOwnerById", groupId);
    }

    // 그룹원 삭제
    public void insertGroupEmployee(Map<String, Object> params) {
        mybatis.insert("CalendarGroup.insertGroupEmployee", params);
    }

    // 그룹원 추가
    public void deleteGroupEmployee(Map<String, Object> params) {
        mybatis.delete("CalendarGroup.deleteGroupEmployee", params);
    }
}
