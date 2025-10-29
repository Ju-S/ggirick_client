package com.kedu.ggirick_client_backend.services.calendar;

import com.kedu.ggirick_client_backend.dao.calendar.CalendarGroupDAO;
import com.kedu.ggirick_client_backend.dto.calendar.CalendarGroupDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CalendarGroupService {
    private final CalendarGroupDAO calendarGroupDAO;

    // 그룹 생성
    @Transactional
    public void insert(CalendarGroupDTO calendarGroupInfo) {
        int groupId = calendarGroupDAO.insert(calendarGroupInfo);

        Map<String, Object> params = new HashMap<>();

        params.put("groupId", groupId);
        params.put("userId", calendarGroupInfo.getOwner());

        calendarGroupDAO.insertGroupEmployee(params);
    }

    // 그룹 수정
    public void updateById(CalendarGroupDTO calendarGroupDTO) {
        calendarGroupDAO.updateById(calendarGroupDTO);
    }

    // 그룹 삭제
    public void deleteById(int groupId) {
        calendarGroupDAO.delete(groupId);
    }

    // 사용자 그룹 목록 조회
    public List<CalendarGroupDTO> getListByUserId(String userId) {
        return calendarGroupDAO.getListByUserId(userId);
    }

    // 그룹 내 사용자 목록 조회
    public List<String> getEmployeeListByGroupId(int groupId) {
        return calendarGroupDAO.getEmployeeListByGroupId(groupId);
    }

    // 그룹 owner 조회
    public String getOwnerById(int groupId) {
        return calendarGroupDAO.getOwnerById(groupId);
    }

    public void updateGroupEmployee(List<String> members, int groupId, String ownerId) {
        // 없던 멤버 추가
        for (String member : members) {
            if(!getEmployeeListByGroupId(groupId).contains(member) && !member.equals(ownerId)) {
                Map<String, Object> params = new HashMap<>();
                params.put("groupId", groupId);
                params.put("userId", member);
                calendarGroupDAO.insertGroupEmployee(params);
            }
        }

        // 있던 멤버 삭제
        for (String existedMember : getEmployeeListByGroupId(groupId)) {
            if(!members.contains(existedMember) && !existedMember.equals(ownerId)) {
                Map<String, Object> params = new HashMap<>();
                params.put("groupId", groupId);
                params.put("userId", existedMember);
                calendarGroupDAO.deleteGroupEmployee(params);
            }
        }
    }
}
