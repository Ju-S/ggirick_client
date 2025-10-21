
import React from 'react';

export default function BaseModal({
                                    isOpen,
                                    onClose,
                                    title,
                                    children

                                  }) {

  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`} role="dialog">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>

        {/* 모달 콘텐츠는 children으로 받습니다. */}
        <div className="py-4">
          {children}
        </div>
      </div>

      {/* 모달 외부 클릭 시 닫기 */}
      <div className="modal-backdrop">
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}