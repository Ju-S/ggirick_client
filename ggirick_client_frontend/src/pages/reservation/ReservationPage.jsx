import { useState } from "react";
import useReservationStore from "../../store/reservation/useReservationStore.js";
import MyReservationTab from "../../components/reservation/tab/MyReservationTab.jsx"
import ReservationCalendarTab from "../../components/reservation/tab/ReservationCalendarTab.jsx";
import ResourceListTab from "../../components/reservation/tab/ResourceListTab.jsx";
import ReservationModal from "../../components/reservation/ReservationModal.jsx";
import ResourceFormModal from "../../components/reservation/ResourceFormModal.jsx";     // 리소스 폼 모달
import ReservationDetailModal from "../../components/reservation/ReservationDetailModal.jsx"; // 상세 모달
export default function ReservationPage() {
  const [activeTab, setActiveTab] = useState("calendar");

    const { isReservationModalOpen, openCreateModal,setResourceModalOpen,
      isResourceModalOpen,
      isReservationDetailModalOpen } = useReservationStore();

  return (
    <main className="flex h-screen flex-col bg-base-100 p-4 pt-20 md:ml-64">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between border-b bg-base-100 p-4">
        <h1 className="text-xl font-semibold">예약 관리</h1>
        <div className="flex gap-2">
            <button
                onClick={openCreateModal}
                className="rounded bg-primary px-3 py-1 text-primary-content" // DaisyUI btn 클래스 추가
            >
                예약 생성
            </button>
          <button
            onClick={() => setResourceModalOpen(true)} // 💡 리소스 모달 열기 액션 연결
            className="rounded bg-primary px-3 py-1 text-primary-content"
          >
            리소스 생성
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-48 overflow-y-auto border-r bg-base-100 p-4">
          <h2 className="mb-2 text-sm font-semibold">예약 관리</h2>
          <ul className="space-y-1">
            <li
              onClick={() => setActiveTab("calendar")}
              className={`cursor-pointer rounded p-2 hover:bg-base-200 ${
                activeTab === "calendar" ? "bg-accent text-accent-content" : ""
              }`}
            >
              캘린더
            </li>
            <li
              onClick={() => setActiveTab("resources")}
              className={`cursor-pointer rounded p-2  ${
                activeTab === "resources" ? "bg-accent text-accent-content" : ""
              }`}
            >
              리소스 목록
            </li>
            <li
              onClick={() => setActiveTab("myReservations")}
              className={`cursor-pointer rounded p-2  ${
                activeTab === "myReservations"
                  ? "bg-accent text-accent-content"
                  : ""
              }`}
            >
              나의 예약
            </li>
          </ul>
        </aside>

        {/* 메인 컨텐츠: 캘린더 + 예약 리스트 */}
          <section className="flex-1 overflow-auto p-4">
              {activeTab === "calendar" && <ReservationCalendarTab />}
              {activeTab === "resources" && <ResourceListTab />}
              {activeTab === "myReservations" && <MyReservationTab />}
          </section>
      </div>

      {isReservationModalOpen && <ReservationModal />}
      {isResourceModalOpen && <ResourceFormModal />}
      {isReservationDetailModalOpen && <ReservationDetailModal />}
    </main>
  );
}
