package com.kedu.ggirick_client_backend.controllers.reservation;


import com.kedu.ggirick_client_backend.dto.UserTokenDTO;
import com.kedu.ggirick_client_backend.dto.reservation.CalendarEventDTO;
import com.kedu.ggirick_client_backend.dto.reservation.ReservationDTO;
import com.kedu.ggirick_client_backend.dto.reservation.ResourceDTO;
import com.kedu.ggirick_client_backend.services.reservation.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ReservationController {


    @Autowired
    private ReservationService reservationService;


    // [캘린더] 탭용: 전체 예약 목록 (기간 필터링)
    @GetMapping("/calendar")
    public ResponseEntity<List<CalendarEventDTO>> getCalendarReservations(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {

        List<CalendarEventDTO> events = reservationService.getCalendarReservations(start, end);
        return ResponseEntity.ok(events);
    }
    // [나의 예약] 탭용: 현재 사용자 예약 목록
    @GetMapping("/my")
    public ResponseEntity<List<ReservationDTO>> getMyReservations(@AuthenticationPrincipal UserTokenDTO userInfo) {
        String employeeId = userInfo.getId();

        List<ReservationDTO> myReservations = reservationService.getMyReservations(employeeId);
        return ResponseEntity.ok(myReservations);
    }

    // [예약 생성] 모달/Drawer 처리
    @PostMapping
    public ResponseEntity<ReservationDTO> createReservation(@RequestBody ReservationDTO reservationDto, @AuthenticationPrincipal UserTokenDTO userInfo) {
        try {
            reservationDto.setEmployeeId(userInfo.getId()); // 로그인한 사용자로 예약자 자동 설정
            ReservationDTO createdReservation = reservationService.createReservation(reservationDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReservation);
        } catch (IllegalStateException e) {
            // 겹침 오류 처리
            return ResponseEntity.badRequest().build(); // 클라이언트에서 에러 메시지를 표시
        }
    }

    // 예약 수정 (FullCalendar Drag & Drop 또는 상세 모달 수정)
    @PutMapping("/{reservationId}")
    public ResponseEntity<ReservationDTO> updateReservation(@PathVariable Long reservationId, @RequestBody ReservationDTO reservationDto) {
        try {
            ReservationDTO updatedReservation = reservationService.updateReservation(reservationId, reservationDto);
            return ResponseEntity.ok(updatedReservation);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // 예약 취소/삭제
    @DeleteMapping("/{reservationId}")
    public ResponseEntity<Void> cancelReservation(@PathVariable Long reservationId) {
        reservationService.cancelReservation(reservationId);
        return ResponseEntity.noContent().build();
    }

    //리소스 목록
    @GetMapping("/resource")
    public ResponseEntity<List<ResourceDTO>> getResources() {
        List<ResourceDTO> resources = reservationService.getAllResources();
        return ResponseEntity.ok(resources);
    }

    //리소스 생성

    @PostMapping("/resource")
    public ResponseEntity<ResourceDTO> createResource(@RequestBody ResourceDTO resourceDto) {
        reservationService.createResource(resourceDto);
        return ResponseEntity.ok(resourceDto);
    }

}
