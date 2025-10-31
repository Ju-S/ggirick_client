package com.kedu.ggirick_client_backend.dao.reservation;


import com.kedu.ggirick_client_backend.dto.reservation.*;
import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class ReservationDAO {

    @Autowired
    private SqlSession mybatis;

    private static final String NAMESPACE = "reservationMapper";

    public List<ResourceDTO> findAllResources() {
        return mybatis.selectList(NAMESPACE+".findAllResources");
    }

    public List<CalendarEventDTO> findReservationsForCalendar(LocalDateTime startDate, LocalDateTime endDate) {
        Map<String, Object> params = new HashMap<>();
        params.put("startDate", startDate);
        params.put("endDate", endDate);
        return mybatis.selectList(NAMESPACE + ".findReservationsForCalendar", params);
    }

    public List<ReservationDTO> findMyReservations(String employeeId) {
        return mybatis.selectList(NAMESPACE + ".findMyReservations", employeeId);
    }

    public List<ResourceTypeDTO> findAllResourceType() {
        return mybatis.selectList(NAMESPACE + ".findAllResourceType");
    }

    public List<ReservationDTO> findOverlappingReservations(Long resourceId, LocalDateTime startedAt, LocalDateTime endedAt, Long excludeId) {
        Map<String, Object> params = new HashMap<>();
        params.put("resourceId", resourceId);
        params.put("start", startedAt);
        params.put("end", endedAt);
        // 수정 시 ID 제외를 위해 excludeId 사용 (null 가능)
        params.put("excludeId", excludeId);

        return mybatis.selectList(NAMESPACE + ".findOverlappingReservations", params);
    }

    public void insertReservation(ReservationDTO reservationDto) {
        mybatis.insert(NAMESPACE + ".insertReservation", reservationDto);

    }

    public ReservationDTO findReservationById(Long id) {
        return mybatis.selectOne(NAMESPACE + ".findReservationById", id);
    }

    public void updateReservation(ReservationDTO reservationDto) {

        mybatis.update(NAMESPACE + ".updateReservation", reservationDto);
    }

    public boolean deleteReservation(Long reservationId) {
        return mybatis.delete(NAMESPACE + ".deleteReservation", reservationId) >0;
    }

    public void createResource(ResourceDTO resourceDto) {
        mybatis.insert(NAMESPACE + ".insertResource", resourceDto);

    }

    public void updateResourceImgUrl(ResourceDTO dto) {
        mybatis.update(NAMESPACE + ".updateResourceImgUrl", dto);
    }

    public void insertResourceImage(ResourceFileDTO imgDTO) {
        mybatis.update(NAMESPACE + ".insertResourceImage", imgDTO);
    }
}
