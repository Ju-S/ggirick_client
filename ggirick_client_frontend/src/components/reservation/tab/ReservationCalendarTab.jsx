import { useState, useEffect, useMemo } from "react";
import { addMonths, subMonths } from "date-fns";
import useReservationStore from '../../../store/reservation/useReservationStore';
import CalendarView from "../../common/CalendarView.jsx";

export default function ReservationCalendarTab() {
    const {
        reservationList,
        resourceList,
        myReservationList,
        fetchCalendarReservations,
        fetchResources,
        fetchMyReservations,
        setDraggedTimeRange,
        setModalOpen,
        setSelectedResourceId,
        updateReservation,
        openDetailModal,
        isLoading
    } = useReservationStore();

    const [selectedResourceId, setSelectedResourceFilter] = useState("전체");

    useEffect(() => {
        const today = new Date();
        fetchCalendarReservations(subMonths(today, 1), addMonths(today, 1));
        fetchResources(); // 리소스 목록 불러오기
        fetchMyReservations();//내 예약 목록 불러오기
    }, []);

    // 필터 적용 된 아이템 실시간 계산
    const filteredEvents = useMemo(() => {
        return reservationList
            .filter(item =>
                selectedResourceId === "전체" || String(item.resourceId) === selectedResourceId
            )
            .map(item => ({
                id: item.id,
                title: item.title,
                start: item.start,
                end: item.end,
                resourceId: item.resourceId,
                allDay: true,
                extendedProps: {
                    description: item.description,
                    createdBy: item.createdBy,
                    logs: item.logs,
                    employeeId: item.employeeId,
                    fullReservationData: item
                }
            }));

    }, [reservationList,selectedResourceId]);

    return (
        <div className="space-y-4 p-4">
            <div className="flex mb-4 gap-2 items-center">
                <select
                    className="select select-bordered w-64"
                    value={selectedResourceId}
                    onChange={e => setSelectedResourceFilter(e.target.value)}
                >
                    <option value="전체">전체 리소스</option>
                    {resourceList.map(res => (
                        <option key={res.id} value={res.id}>{res.name}</option>
                    ))}
                </select>
            </div>

            {/* 캘린더 */}
            <CalendarView
                title="예약 현황 (캘린더)"
                loading={isLoading}
                events={filteredEvents} // 실시간 필터 적용
                onDateSelect={(selectInfo) => {
                    const calendarApi = selectInfo.view.calendar;
                    calendarApi.unselect();
                    setDraggedTimeRange(selectInfo.startStr, selectInfo.endStr);
                    setModalOpen(true);
                    setSelectedResourceId(null);
                }}
                onEventClick={(clickInfo) => {
                    const fullData = clickInfo.event.extendedProps.fullReservationData;
                    openDetailModal(fullData);
                }}
                onEventDrop={async (dropInfo) => {
                    const { event } = dropInfo;
                    let adjustedEnd = event.end;

                    if (event.allDay && adjustedEnd) {
                        const tempEnd = new Date(adjustedEnd);
                        tempEnd.setDate(tempEnd.getDate() - 1);
                        adjustedEnd = tempEnd;
                    }

                    const updatedData = {
                        startedAt: event.start.toISOString(),
                        endedAt: adjustedEnd.toISOString(),
                        resourceId: event.extendedProps.resourceId
                    };

                    const success = await updateReservation(event.id, updatedData);
                    if (!success) {
                        alert("해당 예약을 변경 할 수없습니다!")
                        dropInfo.revert();
                    }
                }}
                onDatesSet={(dateInfo) => {
                    fetchCalendarReservations(dateInfo.start, dateInfo.end);
                }}
                eventDurationEditable={true}
            />
        </div>
    );
}
