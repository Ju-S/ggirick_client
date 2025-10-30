package com.kedu.ggirick_client_backend.controllers.calendar;

import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.calendar.CalendarDTO;
import com.kedu.ggirick_client_backend.services.calendar.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/calendar")
@RequiredArgsConstructor
public class CalendarController {
    private final CalendarService calendarService;

    // 일정 생성
    @PostMapping
    public ResponseEntity<Void> insert(@RequestBody CalendarDTO calendarInfo,
                                       @AuthenticationPrincipal UserTokenDTO userInfo) {
        calendarInfo.setWriter(userInfo.getId());
        calendarService.insert(calendarInfo);
        return ResponseEntity.ok().build();
    }

    // 일정 수정
    @PutMapping("/{calendarId}")
    public ResponseEntity<Void> updateById(@PathVariable int calendarId,
                                           @RequestBody CalendarDTO calendarInfo,
                                           @AuthenticationPrincipal UserTokenDTO userInfo) {
        if(calendarService.getById(calendarId).getWriter().equals(userInfo.getId())) {
            calendarInfo.setId(calendarId);
            calendarService.updateById(calendarInfo);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // 일정 삭제
    @DeleteMapping("/{calendarId}")
    public ResponseEntity<Void> deleteById(@PathVariable int calendarId,
                                           @AuthenticationPrincipal UserTokenDTO userInfo) {
        if(calendarService.getById(calendarId).getWriter().equals(userInfo.getId())) {
            calendarService.deleteById(calendarId);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    // 일정 조회(개인 일정)
    @GetMapping
    public ResponseEntity<List<CalendarDTO>> getListByUserId(@AuthenticationPrincipal UserTokenDTO userInfo) {
        return ResponseEntity.ok(calendarService.getListByUserId(userInfo.getId()));
    }

    @ExceptionHandler
    public ResponseEntity<Void> error(Exception e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }
}
