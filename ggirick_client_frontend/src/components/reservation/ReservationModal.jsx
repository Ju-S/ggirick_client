// src/commons/components/reservation/ReservationFormModal.jsx
import { useEffect, useState } from 'react';
import useReservationStore from '../../store/reservation/useReservationStore';

import BaseModal from '../../components/common/BaseModal'; // BaseModal 임포트

export default function ReservationFormModal() {
  const {
    isReservationModalOpen,
    setModalOpen,
    selectedResourceId,
    resourceList,
    fetchResources,
    fetchCalendarReservations,
    editingReservationId,
    reservationList,
    insertReservation,
    updateReservation,
    draggedTimeRange
  } = useReservationStore();

  const isEditMode = editingReservationId; // 💡 수정 모드 여부 판단


  const [formData, setFormData] = useState({
    resourceId: selectedResourceId || '',
    startedAt: '',
    endedAt: '',
    purpose: '',
  });
  const [overlapError, setOverlapError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getNowFormatted = () => {
    const now = new Date();
    // padStart로 두 자리 맞춰주기
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };

  useEffect(() => {

    if (!isReservationModalOpen) return; // 모달이 닫힐 때는 실행하지 않음


    if (resourceList.length === 0) {
      fetchResources();
    }

    const formatForInput = (isoString) => {
      if (!isoString) return '';

      // 1. 이미 시간 정보가 포함된 경우 ('T' 포함)
      if (isoString.includes('T')) {
        // YYYY-MM-DDTHH:mm 까지만 잘라냄 (ISO 8601 형식)
        return isoString.substring(0, 16);
      }

      // 2. 날짜 정보만 포함된 경우 (예: "2025-10-06")
      if (isoString.length === 10) {
        // 기본 시간을 붙여 YYYY-MM-DDTHH:mm 형식으로 만듦
        // FullCalendar에서 드래그는 주로 예약 생성에 쓰이므로, 시작 시간을 00:00으로 설정하는 것이 일반적입니다.
        return `${isoString}T00:00`;
      }

      // 3. 그 외 알 수 없는 형식인 경우
      return '';
    };
    if (isEditMode) {
      const reservationToEdit = reservationList.find(res => res.id === editingReservationId);

      if (reservationToEdit) {

        setFormData({
          resourceId: reservationToEdit.resourceId,
          startedAt: formatForInput(reservationToEdit.start), // 💡 start/end 필드 사용
          endedAt: formatForInput(reservationToEdit.end),     // 💡 start/end 필드 사용
          purpose: reservationToEdit.purpose || '',
        });

      } else {
        // 수정할 예약을 찾지 못한 경우 (예외 처리)
        alert("수정할 예약 정보를 찾을 수 없습니다.");
        setModalOpen(false);
      }
    } else {
      // 생성 모드 초기화

      const initialStartedAt = draggedTimeRange.start ? formatForInput(draggedTimeRange.start) : '';
      const initialEndedAt = draggedTimeRange.end ? formatForInput(draggedTimeRange.end) : '';

      console.log(draggedTimeRange.start);


      setFormData({
        resourceId: selectedResourceId || (resourceList.length > 0 ? resourceList[0].id : ''),
        startedAt: initialStartedAt || getNowFormatted(),
        endedAt: initialEndedAt,
        purpose: '',
      });
    }
  }, [isReservationModalOpen, isEditMode, editingReservationId, resourceList, fetchResources, selectedResourceId, reservationList]);


  useEffect(() => {
    if (formData.startedAt) {
      if (!formData.endedAt || formData.endedAt < formData.startedAt) {
        setFormData((prev) => ({
          ...prev,
          endedAt: formData.startedAt,
        }));
      }
    }
  }, [formData.startedAt]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setOverlapError('');

  };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (overlapError || !formData.resourceId || !formData.startedAt || !formData.endedAt) {
            alert('필수 정보를 입력하거나 시간 충돌을 해결해 주세요.');
            return;
        } else if (formData.startedAt > formData.endedAt) {
            alert('시작 시간이 종료 시간보다 나중일 수 없습니다.');
            return;
        }

        // 1시간 이상인지 검사 추가
        const start = new Date(formData.startedAt);
        const end = new Date(formData.endedAt);
        const diffInHours = (end - start) / (1000 * 60 * 60); // 밀리초 → 시간 단위로 변환

        if (diffInHours < 1) {
            alert('예약은 최소 1시간 이상이어야 합니다.');
            return;
        }

        setIsSubmitting(true);
        try {
            const dataToSend = {
                resourceId: formData.resourceId,
                purpose: formData.purpose,
                startedAt: formatLocalISO(formData.startedAt),
                endedAt: formatLocalISO(formData.endedAt),
            };

            if (isEditMode) {
                const success = await updateReservation(editingReservationId, dataToSend);
                if (success) {
                    alert('예약이 성공적으로 수정되었습니다.');
                } else {
                    alert('⚠️ 다른 예약과 시간이 겹치거나 하는 이유로 오류가 발생했습니다. 다시 시도해주세요');
                }
            } else {
                const success = await insertReservation(dataToSend);
                if (success) {
                    alert('예약이 성공적으로 생성되었습니다.');
                } else {
                    alert('⚠️ 다른 예약과 시간이 겹치거나 하는 이유로 오류가 발생했습니다. 다시 시도해주세요');
                }
            }

            setModalOpen(false);
        } finally {
            setIsSubmitting(false);
        }
    };


    const formatLocalISO = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return dateString; // 유효하지 않으면 원본 반환

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const closeModal = () => {
    setModalOpen(false);
    setOverlapError('');
  }

  return (
    <BaseModal
      isOpen={isReservationModalOpen}
      onClose={closeModal}
      title={isEditMode ? "예약 수정" : "예약 생성"}
    >
      <p className="pb-4">예약할 리소스와 시간을 선택하세요.</p>
      <form onSubmit={handleSubmit}>

        {/* 리소스 선택 */}
        <div className="form-control w-full mb-4">
          <label className="label"><span className="label-text">{isEditMode ? "예약 정보를 수정합니다." : "예약할 리소스와 시간을 선택하세요."}</span></label>
          <select
            name="resourceId"
            value={formData.resourceId}
            onChange={handleChange}
            className="select select-bordered"
            disabled={isEditMode || selectedResourceId !== null}
            required
          >
            <option value="" disabled>리소스를 선택하세요</option>
            {resourceList.map(r => (<option key={r.id} value={r.id}>{r.name}</option>))}
          </select>
        </div>

        {/* 시작 시간 */}
        <div className="form-control w-full mb-4">
          <label className="label"><span className="label-text">시작 일시 *</span></label>
          <input
            type="datetime-local"
            name="startedAt"
            min={getNowFormatted()}
            value={formData.startedAt}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* 종료 시간 */}
        <div className="form-control w-full mb-4">
          <label className="label"><span className="label-text">종료 일시 *</span></label>
          <input
            type="datetime-local"
            name="endedAt"
            min={formData.startedAt || getNowFormatted()}
            value={formData.endedAt}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
          />
        </div>

        {/* 겹침 에러 메시지 */}
        {overlapError && (
          <div role="alert" className="alert alert-error mb-4">
            <span>{overlapError}</span>
          </div>
        )}

        {/* 예약 목적 */}
        <div className="form-control w-full mb-4">
          <label className="label"><span className="label-text">예약 목적</span></label>
          <textarea
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="textarea textarea-bordered"
            placeholder="간단한 예약 목적을 입력하세요."
          />
        </div>

        <div className="modal-action">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting || !!overlapError}>
            {isSubmitting ? <span className="loading loading-spinner"></span> : (isEditMode ? '수정하기' : '예약하기')}
          </button>
          <button type="button" className="btn" onClick={closeModal}>닫기</button>
        </div>
      </form>
    </BaseModal>
  );
}