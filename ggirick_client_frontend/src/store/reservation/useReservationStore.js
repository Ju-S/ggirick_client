import {create} from "zustand"

import {
    deleteAPI,
    insertAPI,
    myReservationListAPI,
    reservationCalendarListAPI,
    updateAPI
} from "@/api/reservation/reservationAPI.js";

import {resourceListAPI} from "@/api/reservation/resourceAPI.js";


const useReservationStore = create((set, get) => ({
    isReservationModalOpen: false,
    isResourceModalOpen: false,
    isReservationDetailModalOpen: false,
    selectResourceId: null,
    selectedReservation: null,
    editingReservationId: null,
    reservationList: [],
    resourceList: [],
    myReservationList: [],
    draggedTimeRange: {start: null, end: null},

    isLoading: false,
    error: null,

    setModalOpen: (isOpen, editingId = null) => {
        if (isOpen) {
            // 모달을 열 때는 draggedTimeRange를 유지 (select 이벤트에서 채워진 값)
            set({
                isReservationModalOpen: true,
                editingReservationId: editingId,
            });
        } else {
            // 모달을 닫을 때는 모든 임시 상태 초기화
            set({
                isReservationModalOpen: false,
                editingReservationId: null,
                draggedTimeRange: {start: null, end: null}, // 💡 닫을 때만 초기화
            });
        }
    },
    setResourceModalOpen: (isOpen) => set({isResourceModalOpen: isOpen}),
    setSelectedResourceId: (resourceId) =>
        set({selectedResourceId: resourceId}),
    setSelectedReservation: (response) =>
        set({selectedReservation: response, isReservationDetailModalOpen: true}),
    setDetailModalOpen: (isOpen) => set({isReservationDetailModalOpen: isOpen}),
    setLoading: (loading) => set({isLoading: loading}),
    setDraggedTimeRange: (start, end) => set({
        draggedTimeRange: {start, end}
    }),

    openCreateModal: () =>
        set({
            isReservationModalOpen: true,
            selectedResourceId: null,
            editingReservationId: null, // 생성 모드이므로 초기화
        }),

    openDetailModal: (reservationData) =>
        set({
            selectedReservation: reservationData,
            isReservationDetailModalOpen: true,
        }),

    openEditModal: (reservationId) =>
        set({
            editingReservationId: reservationId,
            isReservationModalOpen: true,
            isReservationDetailModalOpen: false,
            selectedResourceId: null,
        }),

    OpenCreateModalWithResource: (resourceId) =>
        set({
            isReservationModalOpen: true,
            selectedResourceId: resourceId,
        }),

    fetchResources: async () => {
        get().setLoading(true);
        try {
            const response = await resourceListAPI();
            set({resourceList: response.data, error: null});
        } catch (err) {
            console.log("리소스 목록을 불러오지 못했습니다.", err);
            set({error: "리소스 목록을 불러오지 못했습니다."});
        } finally {
            get().setLoading(false);
        }
    },
    fetchCalendarReservations: async (start, end) => {
        get().setLoading(true);
        try {
            reservationCalendarListAPI(start, end)
                .then(response => set({reservationList: response.data, error: null}))

        } catch (err) {
            console.log("캘린더 예약 정보을 불러오지 못했습니다.", err);
            set({error: "캘린더 예약 정보을 불러오지 못했습니다."});
        } finally {
            get().setLoading(false);
        }
    },


    // 나의 예약 목록 로드
    fetchMyReservations: async () => {
        get().setLoading(true);
        try {
            // GET /reservations/my
            const response = await myReservationListAPI();
            set({myReservationList: response.data, error: null});


        } catch (err) {
            console.error("Failed to fetch my reservations:", err);
            set({error: "나의 예약 목록을 불러오지 못했습니다."});
        } finally {
            get().setLoading(false);
        }
    },


    insertReservation: async (data) => {
        get().setLoading(true);

        try {
            const response = await insertAPI(data);
            console.log(response);
            const newReservation = response.data;


            // 💡 캘린더 목록 업데이트: 기존 목록에 새로 생성된 예약을 추가합니다.
            const newReservationList = [...get().reservationList, newReservation];
            set({reservationList: newReservationList});

            // 💡 나의 예약 목록 업데이트: 기존 목록에 새로 생성된 예약을 추가합니다.
            const newMyReservationList = [...get().myReservationList, newReservation];
            set({myReservationList: newMyReservationList});


            return true;

        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                "예약 생성에 실패했습니다. (시간 중복/과거 날짜 등)";
            set({error: errorMessage});
            // 실패 시 false 반환
            return false;

        } finally {
            get().setLoading(false);
        }
    },

    //예약 수정

    updateReservation: async (reservationId, updatedData) => {
        get().setLoading(true);
        try {
            const response = await updateAPI(reservationId, updatedData);

            // 캘린더 이벤트를 업데이트합니다.
            const newReservationList = get().reservationList.map((res) =>
                res.id === reservationId ? {...res, ...response.data} : res,
            );
            set({reservationList: newReservationList});

            // 나의 예약 목록도 업데이트할 필요가 있다면 (선택 사항)
            const newMyReservationList = get().myReservationList.map((res) =>
                res.id === reservationId ? {...res, ...response.data} : res,
            );
            set({myReservationList: newMyReservationList});
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                "예약 수정에 실패했습니다. (시간 중복/과거 날짜 등)";
            set({error: errorMessage});
        } finally {
            get().setLoading(false);
        }
    },
    deleteReservation: async (reservationId) => {
        get().setLoading(true);

        try {

            await deleteAPI(reservationId);
            //  성공 시, 해당 ID를 가진 항목을 목록에서 필터링하여 제거합니다.
            const newReservationList = get().reservationList.filter(
                (res) => res.id !== reservationId
            );

            const newMyReservationList = get().myReservationList.filter(
                (res) => res.id !== reservationId
            );

            set({
                reservationList: newReservationList,
                myReservationList: newMyReservationList
            });

            return true;

        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                "예약 삭제에 실패했습니다.";
            set({error: errorMessage});
            console.error("삭제 오류:", err);


            return false;

        } finally {
            get().setLoading(false);
        }
    },

    activeTab: "calendar",
    setActiveTab: (tabName) => {
        set({activeTab: tabName});
    }
}));

export default useReservationStore;