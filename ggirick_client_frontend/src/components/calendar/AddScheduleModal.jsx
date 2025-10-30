import moment from "moment";
import React, {useEffect} from "react";
import useCalendarStore from "@/store/calendar/useCalendarStore.js";
import getContrastColor from "@/utils/calendar/getContrastColor.js";
import {deleteAPI, insertAPI, updateAPI} from "@/api/calendar/calendarAPI.js";
import {useSearchParams} from "react-router-dom";
import useEmployeeStore from "@/store/employeeStore.js";

export default function AddScheduleModal() {
    const {
        initCalendar,
        selectedSchedule,
        setSelectedSchedule,
        newEvent,
        setNewEvent,
        modalOpen,
        setModalOpen
    } = useCalendarStore();
    const {selectedEmployee} = useEmployeeStore();

    const [searchParams] = useSearchParams();
    const groupId = searchParams.get("groupId");

    useEffect(() => {
        initCalendar(groupId);
    }, [groupId]);

    useEffect(() => {
        setNewEvent(
            selectedSchedule || {
                title: "",
                startAt: null,
                endAt: null,
                description: "",
                recurrence: "none",
                recurrenceEnd: null,
                color: "#dddddd"
            }
        );
    }, [selectedSchedule]);

    const handleSaveEvent = () => {
        if (!newEvent.title) {
            alert("제목을 입력해주세요.");
            return;
        }

        // 일정 생성/수정 API 호출
        if (selectedSchedule) {
            updateAPI(selectedSchedule.id, {...newEvent, groupId: groupId})
                .then((res) => {
                    if (res.status === 200) {
                        initCalendar(groupId);
                    } else {
                        alert("일정 수정에 실패하였습니다.");
                    }
                })
                .catch(() => alert("일정 수정에 실패하였습니다."))
                .finally(() => {
                    setModalOpen(false);
                    setSelectedSchedule(null);
                });
        } else {
            insertAPI({...newEvent, groupId: groupId})
                .then((res) => {
                    if (res.status === 200) {
                        initCalendar(groupId);
                    } else {
                        alert("일정 등록에 실패하였습니다.");
                    }
                })
                .catch(() => alert("일정 등록에 실패하였습니다."))
                .finally(() => {
                    setModalOpen(false);
                    setSelectedSchedule(null);
                });
        }
    };

    const handleDeleteEvent = () => {
        if (!selectedSchedule) return;
        // 일정 삭제 API 호출
        deleteAPI(selectedSchedule.id)
            .then((res) => {
                if (res.status === 200) {
                    initCalendar(groupId);
                } else {
                    alert("일정 삭제에 실패하였습니다.");
                }
            })
            .catch(() => alert("일정 삭제에 실패하였습니다."))
            .finally(() => {
                setModalOpen(false);
                setSelectedSchedule(null);
            });
    };

    return (
        <>
            {modalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box relative max-w-md">
                        <button
                            className="btn btn-sm btn-circle absolute right-2 top-2"
                            onClick={() => setModalOpen(false)}
                        >
                            ✕
                        </button>

                        <h3 className="text-xl font-bold mb-4">{selectedSchedule ? selectedSchedule.writer === selectedEmployee.id ? "일정 수정" : "일정" : "일정 추가"}</h3>

                        {/* 제목 */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">제목</label>
                            {selectedSchedule && selectedSchedule.writer !== selectedEmployee.id ? (
                                <div className="p-3 rounded-lg input input-bordered w-full font-semibold">
                                    {newEvent.title}
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    placeholder="일정 제목"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                                    className="input input-bordered w-full"
                                />
                            )}
                        </div>

                        {/* 시작/종료 */}
                        <div className="mb-4 grid grid-cols-2 gap-2">
                            {["startAt", "endAt"].map((field, idx) => (
                                <div key={field}>
                                    <label className="block font-semibold mb-1">{idx === 0 ? "시작" : "종료"}</label>
                                    {selectedSchedule && selectedSchedule.writer !== selectedEmployee.id ? (
                                        <div className="p-2 rounded-lg input input-bordered w-full">
                                            {moment(newEvent[field]).format("YYYY-MM-DD HH:mm")}
                                        </div>
                                    ) : (
                                        <input
                                            type="datetime-local"
                                            value={newEvent[field] ? moment(newEvent[field]).format("YYYY-MM-DDTHH:mm") : ""}
                                            onChange={(e) =>
                                                setNewEvent({...newEvent, [field]: new Date(e.target.value)})
                                            }
                                            className="input input-bordered w-full"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* 내용 */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">내용</label>
                            {selectedSchedule && selectedSchedule.writer !== selectedEmployee.id ? (
                                <div className="p-3 rounded-lg textarea textarea-bordered w-full whitespace-pre-wrap">
                                    {newEvent.description || "내용 없음"}
                                </div>
                            ) : (
                                <textarea
                                    placeholder="내용"
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                                    className="textarea textarea-bordered w-full h-20 resize-none"
                                />
                            )}
                        </div>

                        {/* 반복 */}
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">반복</label>
                            <select
                                className="select select-bordered w-full"
                                value={newEvent.recurrence}
                                onChange={(e) => setNewEvent({...newEvent, recurrence: e.target.value})}
                                disabled={selectedSchedule && selectedSchedule.writer !== selectedEmployee.id}
                            >
                                <option value="none">반복 없음</option>
                                <option value="daily">매일</option>
                                <option value="weekly">매주</option>
                                <option value="monthly">매월</option>
                                <option value="yearly">매년</option>
                            </select>

                            {newEvent.recurrence !== "none" && (
                                <div className="mt-2">
                                    <label className="block font-semibold mb-1">반복 종료일</label>
                                    <input
                                        type="datetime-local"
                                        value={newEvent.recurrenceEnd ? moment(newEvent.recurrenceEnd).format("YYYY-MM-DDTHH:mm") : ""}
                                        onChange={(e) => setNewEvent({
                                            ...newEvent,
                                            recurrenceEnd: new Date(e.target.value)
                                        })}
                                        className="input input-bordered w-full"
                                        disabled={selectedSchedule && selectedSchedule.writer !== selectedEmployee.id}
                                    />
                                </div>
                            )}
                        </div>

                        {/* 색상 표시 (읽기 전용) */}
                        {selectedSchedule && selectedSchedule.writer !== selectedEmployee.id && (
                            <div className="mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full" style={{backgroundColor: newEvent.color}}></span>
                                <span>{newEvent.color}</span>
                            </div>
                        )}

                        {/* 색상 선택 */}
                        {selectedSchedule && selectedSchedule.writer === selectedEmployee.id &&
                            <>
                                <div className="mb-4">
                                    <label className="block font-semibold mb-1">색상</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={newEvent.color}
                                            onChange={(e) => setNewEvent({...newEvent, color: e.target.value})}
                                            className="w-16 h-10 p-0 border-0 cursor-pointer"
                                        />
                                        <span
                                            className="px-2 py-1 rounded font-semibold"
                                            style={{
                                                backgroundColor: newEvent.color,
                                                color: getContrastColor(newEvent.color)
                                            }}
                                        >
                                    {newEvent.title ? newEvent.title : "텍스트 미리보기"}
                                </span>
                                    </div>
                                </div>

                                {/* 버튼 */}
                                <div className="flex gap-2">
                                    <button className="btn btn-primary flex-1" onClick={handleSaveEvent}>
                                        수정
                                    </button>
                                    <button className="btn btn-error flex-1" onClick={handleDeleteEvent}>
                                        삭제
                                    </button>
                                </div>
                            </>
                        }

                        {!selectedSchedule &&
                            <div className="flex gap-2">
                                <button className="btn btn-primary flex-1" onClick={handleSaveEvent}>
                                    추가
                                </button>
                            </div>
                        }
                    </div>
                </div>
            )}
        </>
    )

}
