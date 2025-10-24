import { useEffect } from 'react';
import { format } from 'date-fns';
import useReservationStore from '../../../store/reservation/useReservationStore';

export default function MyReservationTab() {
  const {
    myReservationList,
    fetchMyReservations,
    isLoading,
    openDetailModal,
    deleteReservation,
    fetchCalendarReservations
  } = useReservationStore();

  useEffect(() => {
    fetchMyReservations(); // 컴포넌트 마운트 시 나의 예약 목록 로드


  }, [fetchMyReservations]);

  const handleDetailEditClick = (reservation) =>{
    openDetailModal(reservation);
  }



  const handleDeleteClick = async (reservationId ) => { // 💡 async 추가


    if (confirm("정말로 이 예약을 삭제하시겠습니까?")) {
      // 💡 await을 사용하여 비동기 호출 결과를 기다립니다.
      const success = await deleteReservation(reservationId );

      if (success) {

        alert('예약이 성공적으로 삭제되었습니다.');
      } else {
        // deleteReservation 내부에서 set({error: ...})가 호출되었을 것입니다.
        alert('예약 삭제에 실패했습니다. ');
      }
    }
  }

  const getStatusBadge = (status) => {
    let color = "badge-neutral";
    if (status === "CONFIRMED") color = "badge-success";
    if (status === "CANCELED") color = "badge-error";
    return <span className={`badge ${color} text-primary-content`}>{status}</span>;
  };


  if (isLoading) return <progress className="progress w-full"></progress>;
  if (myReservationList.length === 0) return <div className="text-center p-8">예약 내역이 없습니다.</div>;

  return (
    <div className="card bg-base-100/10 shadow-xl p-4">
      <h2 className="text-2xl font-bold mb-4">나의 예약 목록</h2>
      <div className="overflow-x-auto">
        <table className="table w-full table-zebra"> {/* DaisyUI table */}
          <thead>
          <tr>
            <th>리소스</th>
            <th>예약 일시</th>
            <th>예약 목적</th>
            <th>상태</th>
            <th>액션</th>
          </tr>
          </thead>
          <tbody>
          {myReservationList.map(reservation => (
            <tr key={reservation.id}>
              <td>{reservation.resourceName}</td>
              <td>
                {format(new Date(reservation.startedAt), 'MM/dd HH:mm')} ~ <br/>
                {format(new Date(reservation.endedAt), 'MM/dd HH:mm')}
              </td>
              <td>{reservation.purpose || '-'}</td>
              <td>{getStatusBadge(reservation.logs)}</td>
              <td>
                <button className="btn btn-ghost btn-xs" onClick={() => handleDetailEditClick(reservation)}>상세/수정</button>
                <button className="btn btn-error btn-xs ml-2" onClick={() =>handleDeleteClick(reservation.id)} >취소</button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}