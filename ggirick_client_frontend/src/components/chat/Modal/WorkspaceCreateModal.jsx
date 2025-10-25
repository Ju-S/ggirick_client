import { useState, useEffect } from "react";
import BaseModal from "@/components/common/BaseModal.jsx";
import useChatStore from "@/store/chat/useChatStore.js";
import chatAPI from "@/api/chat/chatAPI.js";

export default function WorkspaceCreateModal({ open, onClose }) {
    const { fetchWorkspaces, workspaces, isLoading } = useChatStore();
    const [form, setForm] = useState({ name: "" });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // 모달이 열릴 때마다 초기화
    useEffect(() => {
        if (open) {
            setForm({ name: "" });
            setError("");
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!form.name.trim()) {
            setError("워크스페이스 이름을 입력해주세요.");
            return false;
        }
        if (form.name.length > 50) {
            setError("워크스페이스 이름은 50자 이하로 입력해주세요.");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setSubmitting(true);

        console.log(form);
        const success = await chatAPI.createWorkspace(form); // useChatStore에 구현 필요

        setSubmitting(false);

        if (success) {

            onClose();
            await fetchWorkspaces();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <BaseModal isOpen={open} onClose={onClose} title="새 워크스페이스 생성">
            <div className="flex flex-col gap-4 mt-3">
                <div>
                    <label className="block text-sm font-medium mb-1">워크스페이스 이름</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-base-100 text-base-content border border-base-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="예: 개발팀"
                        disabled={submitting || isLoading}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">설명</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        rows={3}
                        className="w-full border border-base-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="워크스페이스 설명을 입력하세요."
                        disabled={submitting || isLoading}
                    />
                </div>

                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        className="px-4 py-2 bg-accent-200 rounded-lg text-sm hover:bg-accent disabled:opacity-50"
                        onClick={onClose}
                        disabled={submitting || isLoading}
                    >
                        취소
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium text-primary-content ${
                            submitting || isLoading
                                ? "bg-primary/60 cursor-not-allowed"
                                : "bg-primary hover:bg-primary/90"
                        }`}
                        onClick={handleSubmit}
                        disabled={submitting || isLoading}
                    >
                        {submitting || isLoading ? "생성중..." : "생성"}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
}
