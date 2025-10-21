package com.kedu.ggirick_client_backend.services.reservation;


import com.kedu.ggirick_client_backend.dao.reservation.ReservationDAO;
import com.kedu.ggirick_client_backend.dto.reservation.CalendarEventDTO;
import com.kedu.ggirick_client_backend.dto.reservation.ReservationDTO;
import com.kedu.ggirick_client_backend.dto.reservation.ResourceDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationDAO reservationDAO;

    //리소스 목록 조회
    public List<ResourceDTO> getAllResources() {
        return reservationDAO.findAllResources();
    }

    @Transactional(readOnly = true)
    public List<CalendarEventDTO> getCalendarReservations(LocalDateTime startDate, LocalDateTime endDate) {
        return reservationDAO.findReservationsForCalendar(startDate, endDate);
    }

    // 나의 예약 목록 조회
    @Transactional(readOnly = true)
    public List<ReservationDTO> getMyReservations(String employeeId) {
        return reservationDAO.findMyReservations(employeeId);
    }

    //예약 등록
    public ReservationDTO createReservation(ReservationDTO reservationDto) {
        // 예약 시간 겹침 검증
        List<ReservationDTO> overlaps = reservationDAO.findOverlappingReservations(
                reservationDto.getResourceId(), reservationDto.getStartedAt(), reservationDto.getEndedAt(), null);

        if (!overlaps.isEmpty()) {
            throw new IllegalStateException("해당 시간에 이미 예약된 항목이 있습니다.");
        }

        // 예약 등록
        reservationDto.setReservatedAt(LocalDateTime.now());
        reservationDto.setStatus("CONFIRMED"); // 기본 상태
        reservationDAO.insertReservation(reservationDto);

        return reservationDAO.findReservationById(reservationDto.getId());
    }

    //에약 업데이트
    public ReservationDTO updateReservation(Long reservationId, ReservationDTO reservationDto) {
        reservationDto.setId(reservationId);

        // 수정 시간 기준 겹침 검증 (현재 예약은 제외)
        List<ReservationDTO> overlaps = reservationDAO.findOverlappingReservations(
                reservationDto.getResourceId(), reservationDto.getStartedAt(), reservationDto.getEndedAt(), reservationId);

        if (!overlaps.isEmpty()) {
            throw new IllegalStateException("수정하려는 시간에 이미 예약된 항목이 있습니다.");
        }

        reservationDAO.updateReservation(reservationDto);
        return reservationDAO.findReservationById(reservationId);
    }

    public void cancelReservation(Long reservationId) {
        // 실제로는 상태를 CANCELED로 업데이트하는 것이 일반적
        ReservationDTO dto = new ReservationDTO();
        dto.setId(reservationId);
        dto.setStatus("CANCELED");
        //  reservationDAO.updateReservation(dto);
        reservationDAO.deleteReservation(reservationId);

    }

    public void createResource(ResourceDTO resourceDto) {
        reservationDAO.createResource(resourceDto);
    }
}
