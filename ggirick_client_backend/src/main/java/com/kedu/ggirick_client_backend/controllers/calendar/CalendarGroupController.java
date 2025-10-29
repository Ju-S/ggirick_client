package com.kedu.ggirick_client_backend.controllers.calendar;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.calendar.CalendarDTO;
import com.kedu.ggirick_client_backend.dto.calendar.CalendarGroupDTO;
import com.kedu.ggirick_client_backend.services.calendar.CalendarGroupService;
import com.kedu.ggirick_client_backend.services.calendar.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/calendar/group")
@RequiredArgsConstructor
public class CalendarGroupController {
    private final CalendarGroupService calendarGroupService;
    private final CalendarService calendarService;

    // 일정 그룹 생성
    @PostMapping
    public ResponseEntity<Void> insert(@RequestBody CalendarGroupDTO calendarGroupInfo,
                                       @AuthenticationPrincipal UserTokenDTO userInfo) {
        calendarGroupInfo.setOwner(userInfo.getId());
        calendarGroupService.insert(calendarGroupInfo);
        return ResponseEntity.ok().build();
    }

    // 일정 그룹 수정
    @PutMapping("/{groupId}")
    public ResponseEntity<Void> update(@PathVariable int groupId,
                                       @RequestBody CalendarGroupDTO calendarGroupInfo,
                                       @AuthenticationPrincipal UserTokenDTO userInfo) {
        if(calendarGroupService.getOwnerById(groupId).equals(userInfo.getId())) {
            calendarGroupInfo.setId(groupId);
            calendarGroupService.updateById(calendarGroupInfo);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // 일정 그룹 삭제
    @DeleteMapping("/{groupId}")
    public ResponseEntity<Void> delete(@PathVariable int groupId,
                                       @AuthenticationPrincipal UserTokenDTO userInfo) {
        if(calendarGroupService.getOwnerById(groupId).equals(userInfo.getId())) {
            calendarGroupService.deleteById(groupId);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // 일정 그룹 목록 조회
    @GetMapping
    public ResponseEntity<List<CalendarGroupDTO>> getList(@AuthenticationPrincipal UserTokenDTO userInfo) {
        return ResponseEntity.ok(calendarGroupService.getListByUserId(userInfo.getId()));
    }

    // 일정 조회(그룹 일정)
    @GetMapping("/{groupId}")
    public ResponseEntity<List<CalendarDTO>> getCalendarListByGroupId(@PathVariable int groupId,
                                                                      @AuthenticationPrincipal UserTokenDTO userInfo) {
        if(calendarGroupService.getEmployeeListByGroupId(groupId).contains(userInfo.getId())) {
            return ResponseEntity.ok(calendarService.getListByGroupId(groupId));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // 일정 그룹 멤버 조회
    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<String>> getEmployeeListByGroupId(@PathVariable int groupId) {
        return ResponseEntity.ok(calendarGroupService.getEmployeeListByGroupId(groupId));
    }

    // 일정 그룹 멤버 수정
    @PutMapping("/{groupId}/members")
    public ResponseEntity<Void> updateCalendarGroupEmployee(@PathVariable int groupId,
                                                         @RequestBody List<String> members,
                                                         @AuthenticationPrincipal UserTokenDTO userInfo) {
        if (calendarGroupService.getOwnerById(groupId).equals(userInfo.getId())) {
            calendarGroupService.updateGroupEmployee(members, groupId, userInfo.getId());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @ExceptionHandler
    public ResponseEntity<Void> error(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
