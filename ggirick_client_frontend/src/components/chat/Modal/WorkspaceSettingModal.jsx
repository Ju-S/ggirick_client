import React, { useEffect, useState } from "react";
import BaseModal from "@/components/common/BaseModal.jsx";
import { formatDate } from "@/utils/task/formatDate.js";
import useChatStore from "@/store/chat/useChatStore.js";
import chatAPI from "@/api/chat/chatAPI.js";

export default function WorkspaceSettingModal({ open, onClose }) {
    const { selectedWorkspace, updateSelectedWorkspace, workspaceRole, setSelectedWorkspace,removeWorkspace } = useChatStore();

    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [form, setForm] = useState({ name: "", description: "" });

    // 선택된 워크스페이스 변경 시 form 갱신
    useEffect(() => {
        if (selectedWorkspace) {
            setForm({
                name: selectedWorkspace.name || "",
                description: selectedWorkspace.description || "",
            });
        } else {
            setForm({ name: "", description: "" });
        }
    }, [selectedWorkspace]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!selectedWorkspace) return alert("선택된 워크스페이스가 없습니다.");
        if (!form.name.trim()) return alert("워크스페이스 이름을 입력해주세요");
        if (!form.description.trim()) return alert("워크스페이스 설명을 입력해주세요");

        setIsSaving(true);
        try {
            await chatAPI.updateWorkspace(selectedWorkspace.id, form);
            updateSelectedWorkspace(form);
            onClose();
        } catch (error) {
            console.error(error);
            alert("워크스페이스 정보를 저장하는 중 오류가 발생했습니다.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedWorkspace) return alert("삭제할 워크스페이스가 없습니다.");
        if (!confirm("정말 이 워크스페이스를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;

        setIsDeleting(true);
        try {
            await chatAPI.deleteWorkspace(selectedWorkspace.id);

            alert("워크스페이스가 삭제되었습니다.");
            onClose();
            removeWorkspace(selectedWorkspace.id);
            setSelectedWorkspace(null);
        } catch (error) {
            console.error(error);
            alert("워크스페이스 삭제 중 오류가 발생했습니다.");
        } finally {
            setIsDeleting(false);
        }
    };

    // 워크스페이스가 선택되지 않았을 때 표시
    if (!selectedWorkspace) {
        return (
            <BaseModal isOpen={open} onClose={onClose} title="워크스페이스 관리">
                <div className="py-6 text-center text-gray-500">
                    선택된 워크스페이스가 없습니다.
                </div>
                <div className="flex justify-end mt-4">
                    <button onClick={onClose} className="btn btn-sm btn-ghost">
                        닫기
                    </button>
                </div>
            </BaseModal>
        );
    }

    return (
        <BaseModal isOpen={open} onClose={onClose} title="워크스페이스 관리">
            <div className="flex flex-col gap-3">
                <label className="form-control w-full">
                    <span className="label-text text-sm">워크스페이스 이름</span>
                    <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        placeholder="워크스페이스 이름을 입력하세요"
                    />
                </label>

                <label className="form-control w-full">
                    <span className="label-text text-sm">설명</span>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full"
                        placeholder="워크스페이스 설명을 입력하세요"
                    />
                </label>

                <div>
                    <p>워크스페이스 생성일: {formatDate(selectedWorkspace.createdAt)}</p>
                </div>

                <div className="flex justify-between items-center mt-4">
                    {/*  왼쪽: 삭제 버튼 (OWNER만 표시) */}
                    {workspaceRole === "OWNER" && (
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="btn btn-sm btn-error"
                        >
                            {isDeleting ? "삭제 중..." : "워크스페이스 삭제"}
                        </button>
                    )}

                    {/* 오른쪽: 취소 / 저장 버튼 */}
                    <div className="flex gap-2">
                        <button onClick={onClose} className="btn btn-sm btn-ghost">
                            취소
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="btn btn-sm btn-primary"
                        >
                            {isSaving ? "저장 중..." : "저장"}
                        </button>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
}
