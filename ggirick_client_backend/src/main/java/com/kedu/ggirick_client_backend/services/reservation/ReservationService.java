package com.kedu.ggirick_client_backend.services.reservation;


import com.kedu.ggirick_client_backend.dao.reservation.ReservationDAO;
import com.kedu.ggirick_client_backend.dto.reservation.*;
import com.kedu.ggirick_client_backend.utils.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ReservationService {

    @Autowired
    private ReservationDAO reservationDAO;

    @Autowired
    private FileUtil fileUtil;

    //리소스 목록 조회
    public List<ResourceDTO> getAllResources() {
        return reservationDAO.findAllResources();
    }

    //리소스 타입 목록 조회

    public List<ResourceTypeDTO> getAllResourceTypes() {
        return reservationDAO.findAllResourceType();
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
    public ReservationDTO updateReservation(Long reservationId, ReservationDTO reservationDto,String userId) {
        reservationDto.setId(reservationId);

        if(reservationDto.getEmployeeId().equals(userId)) {

            // 수정 시간 기준 겹침 검증 (현재 예약은 제외)
            List<ReservationDTO> overlaps = reservationDAO.findOverlappingReservations(
                    reservationDto.getResourceId(), reservationDto.getStartedAt(), reservationDto.getEndedAt(), reservationId);

            if (!overlaps.isEmpty()) {
                throw new IllegalStateException("수정하려는 시간에 이미 예약된 항목이 있습니다.");
            }

            reservationDAO.updateReservation(reservationDto);
            return reservationDAO.findReservationById(reservationId);
        }else{
            return null;
        }


    }

    public boolean cancelReservation(Long reservationId, String userId) {
        
        ReservationDTO dto =  reservationDAO.findReservationById(reservationId);
        
        if(dto == null ||!dto.getEmployeeId().equals(userId)) {
            //해당 예약이 존재하지 않는 경우
            //혹은 예약한 직원이 아닌 사람이 해당 예약을 삭제하려 하는 경우
            return false;
        }
        
        
        // 실제로는 상태를 CANCELED로 업데이트하는 것이 일반적
      
        dto.setId(reservationId);
        dto.setStatus("CANCELED");
        //  reservationDAO.updateReservation(dto);
        return reservationDAO.deleteReservation(reservationId);

    }

    public void createResource(ResourceDTO dto) throws Exception {

        //1.

        reservationDAO.createResource(dto);

        MultipartFile file = dto.getFile();
        if (file != null && !file.isEmpty()) {
            Map<String, String> fileInfo = fileUtil.uploadFileAndGetInfo(file.getOriginalFilename(), "resources/", file);

            //  대표 이미지 URL 세팅
            dto.setImgUrl(fileInfo.get("url"));
            reservationDAO.updateResourceImgUrl(dto);

            //  이미지 정보 별도 테이블에 저장
            ResourceFileDTO imgDTO = new ResourceFileDTO();
            imgDTO.setReservationResourceId(dto.getId());
            imgDTO.setFileUrl(fileInfo.get("url"));
            imgDTO.setFilename(fileInfo.get("oriName"));
            imgDTO.setSysname(fileInfo.get("sysName"));

            reservationDAO.insertResourceImage(imgDTO);
        }
    }
}
