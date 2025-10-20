/**
 * 서버 오류 / 안내 전용 모달
 *
 * @param {boolean} isOpen - 모달 열림 여부
 * @param {function} onClose - 닫기 함수
 * @param {string} title - 제목 (기본: "오류 발생")
 * @param {string} message - 본문 메시지
 * @param {string} type - "error" | "warn" | "info" → 색상 자동 지정
 */
export default function AlertModal({
                                       isOpen,
                                       onClose,
                                       title = "오류 발생",
                                       message = "서버 요청 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
                                       type = "error",
                                   }) {
    if (!isOpen) return null;

    const colorClass =
        type === "error"
            ? "text-red-600"
            : type === "warn"
                ? "text-yellow-600"
                : "text-blue-600";

    return (
        <dialog className="modal modal-open">
            <div className="modal-box bg-base-100 max-w-sm text-center">
                <h3 className={`text-lg font-bold mb-2 ${colorClass}`}>{title}</h3>
                <p className="text-sm text-gray-600 mb-6 whitespace-pre-line">{message}</p>

                <button className="btn btn-primary" onClick={onClose}>
                    확인
                </button>
            </div>

            {/* 배경 클릭 시 닫기 */}
            <form method="dialog" className="modal-backdrop">
                <button onClick={onClose}>close</button>
            </form>
        </dialog>
    );
}
