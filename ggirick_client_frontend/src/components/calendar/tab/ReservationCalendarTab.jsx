import {useCallback, useEffect} from "react";
import { addMonths, subMonths } from "date-fns";
import useReservationStore from '../../../store/reservation/useReservationStore';
import CalendarView from "../../common/CalendarView.jsx";

export default function ReservationCalendarTab() {
  const {
    reservationList,
    fetchCalendarReservations,
    setLoading,
    isLoading,
    setModalOpen,
    setSelectedResourceId,
      updateReservation,
      openDetailModal,
    setDraggedTimeRange
  } = useReservationStore();


  useEffect(() => {
    const today = new Date();
    fetchCalendarReservations(subMonths(today, 1), addMonths(today, 1));
  }, []);

  const events = reservationList.map(item => ({
    id: item.id,
    title: item.title,
    start: item.start,
    end: item.end,
    resourceId: item.resourceId,
    allDay: false,
    extendedProps: {
      description: item.description,
      createdBy: item.createdBy,
      status: item.status,
      employeeId: item.employeeId,
        fullReservationData: item
    }
  }));
    const formatLocalISO = (date) => {
        // KST(UTC+9)를 기준으로 YYYY-MM-DDTHH:mm:ss 문자열을 만듭니다.
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // 'Z' (UTC)를 붙이지 않고 로컬 시간을 서버에 보냅니다.
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };
    const handleEventDrop = async (dropInfo) => {
        const { event, oldEvent } = dropInfo;

        // 과거 날짜로 이동하는지 유효성 검사 (오늘 날짜 기준)
        const now = new Date();
      
        if (new Date(event.end) < now) {
            alert("⚠️ 과거 날짜로 예약을 변경할 수 없습니다.");
            dropInfo.revert(); // 이벤트 위치를 원래대로 되돌립니다.
            return;
        }
        //FullCalendar의 end 날짜는 exclusive → 하루 빼기 (종일 이벤트일 경우)
        let adjustedEnd = event.end;
        // 종일(allDay) 이벤트 처리 (종료 날짜는 다음 날 0시를 가리키므로 하루 전으로 조정)
        if (event.allDay && adjustedEnd) {
            // adjustedEnd를 복사하여 수정
            const tempEnd = new Date(adjustedEnd);
            // FullCalendar는 종료일이 다음 날 0시를 나타내므로 하루를 뺌
            tempEnd.setDate(tempEnd.getDate() - 1);
            adjustedEnd = tempEnd;
        }


        // 여기서는 이동된 이벤트의 시간 정보를 서버에 보냄
        const updatedData = {
            startedAt: formatLocalISO(event.start),
            endedAt: formatLocalISO(adjustedEnd),
            resourceId: event.extendedProps.resourceId
        };

        console.log(`예약 ${event.id} 수정 시도:`, updatedData);

        // 서버에 PUT 요청
        const success = await updateReservation(event.id, updatedData);

        if (!success) {
            // updateReservation에서 에러 발생 시 (예: 중복 예약, 서버 오류)
            dropInfo.revert(); // 이벤트 위치를 원래대로 되돌립니다.
        } else {
            alert(`✅ 예약 '${event.title}'이(가) 성공적으로 수정되었습니다.`);
        }
    };

    const handleEventClick = (clickInfo) =>{
        const fullData = clickInfo.event.extendedProps.fullReservationData;

        openDetailModal({
            ...fullData,

        });
    }

  const handleDateSelect = (selectInfo) => {

    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    // 💡 디버깅 필수: selectInfo.startStr과 selectInfo.endStr 값 확인
    console.log("FullCalendar Select Info:", selectInfo);

    setDraggedTimeRange(selectInfo.startStr, selectInfo.endStr);

    // 3. 예약 생성 모달 열기
    setModalOpen(true);
    setSelectedResourceId(null);
  };

  return (
    <CalendarView
      title="전체 예약 현황 (캘린더)"
      loading={isLoading}
      events={events}
      onDateSelect={
        handleDateSelect
      }

      onEventClick={ handleEventClick}
      onEventDrop={handleEventDrop}

      onDatesSet={(dateInfo) => {
        fetchCalendarReservations(dateInfo.start, dateInfo.end);
      }}
      eventDurationEditable = {true}

    />
  );
}
