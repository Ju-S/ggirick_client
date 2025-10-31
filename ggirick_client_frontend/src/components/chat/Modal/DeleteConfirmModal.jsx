import React from "react";
import BaseModal from "@/components/common/BaseModal.jsx";

export default function DeleteConfirmModal({
                                               open,
                                               title = "삭제 확인",
                                               message = "정말 삭제하시겠습니까?",
                                               onConfirm,
                                               onCancel,
                                           }) {
    return (
        <BaseModal isOpen={open} onClose={onCancel} title={title}>
            <p className="mb-6">{message}</p>

            <div className="flex justify-end gap-4">
                <button
                    className="px-4 py-2 bg-base-200 rounded hover:bg-secondary"
                    onClick={onCancel}
                >
                    취소
                </button>
                <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={onConfirm}
                >
                    삭제
                </button>
            </div>
        </BaseModal>
    );
}
