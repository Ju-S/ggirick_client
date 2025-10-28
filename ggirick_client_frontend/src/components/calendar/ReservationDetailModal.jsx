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

  const onClose = () => {
    setDetailModalOpen(false);

  };


  if (!selectedReservation) return null; // 데이터 없으면 렌더링 안 함

  console.log(selectedReservation);

  const handleEditClick = () => {
    if (selectedReservation && selectedReservation.id) {
      openEditModal(selectedReservation.id); // 예약 ID와 함께 수정 모드 열기
    }
  };

  const handleDeleteClick = async () => { // 💡 async 추가
    if (!selectedReservation || !selectedReservation.id) return;

    if (confirm("정말로 이 예약을 삭제하시겠습니까?")) {
      // 💡 await을 사용하여 비동기 호출 결과를 기다립니다.
      const success = await deleteReservation(selectedReservation.id);

      if (success) {
        onClose(); // 삭제 성공 시에만 모달 닫기
        alert('예약이 성공적으로 삭제되었습니다.');
      } else {
        // deleteReservation 내부에서 set({error: ...})가 호출되었을 것입니다.
        alert('예약 삭제에 실패했습니다.');
      }
    }
  }

  // 💡 헬퍼 함수: 유효한 날짜 포맷팅을 위한 안전장치
  const formatSafeDate = (dateString) => {
    // 1. 값이 존재하는지 확인
    if (!dateString) return '날짜 정보 없음';

    const date = new Date(dateString);

    // 2. Date 객체가 유효한지 확인
    if (isNaN(date)) {
      console.error("Invalid Date String:", dateString);
      return '잘못된 날짜 형식';
    }

    // 3. 유효하다면 포맷팅
    return format(date, 'yyyy년 MM월 dd일 HH:mm');
  };

  const getReservationDateString = (fieldPrefix) => {
    // 캘린더 이벤트 데이터 필드 (start/end)
    const calField = selectedReservation[fieldPrefix];
    // 서버 원본 데이터 필드 (startedAt/endedAt)
    const apiField = selectedReservation[fieldPrefix + 'edAt'];

    // API 필드를 우선하고, 없으면 캘린더 필드를 사용합니다. (null/undefined/"" 허용)
    return apiField || calField;
  };

  return (
    <BaseModal
      isOpen={isReservationDetailModalOpen}
      onClose={onClose}
      title="예약 상세 정보"

    >
      <div className="space-y-3">
        <p><strong>리소스:</strong> {selectedReservation.title||selectedReservation.resourceName|| '정보 없음'}</p>
        <p><strong>시작:</strong> {formatSafeDate(getReservationDateString('start')) }</p>
        <p><strong>종료:</strong> {formatSafeDate(getReservationDateString('end'))}</p>
        <p><strong>예약자:</strong> {selectedReservation.employeeName || '정보 없음'}</p>
        <p>
          <strong>상태:</strong>
          <span className={`badge ml-2 ${selectedReservation.status === 'CONFIRMED' ? 'badge-success' : selectedReservation.status === 'CANCELED' ? 'badge-error' : 'badge-neutral'}`}>
            {selectedReservation.status}
          </span>
        </p>
        <p><strong>예약 목적:</strong> {selectedReservation.purpose || '없음'}</p>

        <div className="pt-4 flex justify-end gap-2">
          <button className="btn btn-warning" onClick={handleEditClick}>예약 수정</button>
          <button className="btn btn-error" onClick={handleDeleteClick}>예약 삭제</button>
        </div>
      </div>
    </BaseModal>
  );
}