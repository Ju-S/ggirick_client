import {useEffect, useMemo} from "react";
import useReservationStore from '../../store/reservation/useReservationStore';
import BaseModal from '../../components/common/BaseModal';
import { format } from 'date-fns';

export default function ReservationDetailModal() {
    const {
        selectedReservation,
        isReservationDetailModalOpen,
        setDetailModalOpen,
        openEditModal,
        deleteReservation
    } = useReservationStore();

    if (!selectedReservation) return null;

    useEffect(() => {
      console.log(selectedReservation)
    }, []);

    const onClose = () => setDetailModalOpen(false);

    const handleEditClick = () => {
        if (selectedReservation && selectedReservation.id) {
            openEditModal(selectedReservation.id);
        }
    };

    const handleDeleteClick = async () => {
        if (!selectedReservation || !selectedReservation.id) return;
        if (confirm("정말로 이 예약을 삭제하시겠습니까?")) {
            const success = await deleteReservation(selectedReservation.id);
            if (success) {
                onClose();
                alert('예약이 성공적으로 삭제되었습니다.');
            } else {
                alert('예약 삭제에 실패했습니다.');
            }
        }
    };

    const formatSafeDate = (dateString) => {
        if (!dateString) return '날짜 정보 없음';
        const date = new Date(dateString);
        if (isNaN(date)) return '잘못된 날짜 형식';
        return format(date, 'yyyy년 MM월 dd일 HH:mm');
    };

    const getReservationDateString = (fieldPrefix) => {
        const calField = selectedReservation[fieldPrefix];
        const apiField = selectedReservation[fieldPrefix + 'edAt'];
        return apiField || calField;
    };

    // 🔹 종료일이 현재보다 이전인지 확인
    const isPastEnd = useMemo(() => {
        const endDateStr = getReservationDateString('end');
        if (!endDateStr) return false;
        const endDate = new Date(endDateStr);
        return endDate < new Date();
    }, [selectedReservation]);

    return (
        <BaseModal
            isOpen={isReservationDetailModalOpen}
            onClose={onClose}
            title="예약 상세 정보"
        >
            <div className="space-y-3">
                <p><strong>리소스:</strong> {selectedReservation.title || selectedReservation.resourceName || '정보 없음'}</p>
                <p><strong>시작:</strong> {formatSafeDate(getReservationDateString('start'))}</p>
                <p><strong>종료:</strong> {formatSafeDate(getReservationDateString('end'))}</p>
                <p><strong>예약자:</strong> {selectedReservation.employeeName || '정보 없음'}</p>
                <p>
                    <strong>상태:</strong>
                    <span className={`badge ml-2 ${
                        selectedReservation.logs === 'CONFIRMED' ? 'badge-success' :
                            selectedReservation.logs === 'CANCELED' ? 'badge-error' :
                                'badge-neutral'
                    }`}>
            {selectedReservation.status}
          </span>
                </p>
                <p><strong>예약 목적:</strong> {selectedReservation.purpose || '없음'}</p>

                {/* 🔹 종료일 이전이면 버튼 숨김 */}
                {!isPastEnd && (
                    <div className="pt-4 flex justify-end gap-2">
                        <button className="btn btn-warning" onClick={handleEditClick}>예약 수정</button>
                        <button className="btn btn-error" onClick={handleDeleteClick}>예약 삭제</button>
                    </div>
                )}
            </div>
        </BaseModal>
    );
}
