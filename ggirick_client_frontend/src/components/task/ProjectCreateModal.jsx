import { useState, useEffect } from "react";
import BaseModal from "@/components/common/BaseModal.jsx";
import useTaskProjectStore from "@/store/task/useTaskProjectStore.js";

export default function ProjectCreateModal({ open, onClose }) {
    const { createProject, isLoading } = useTaskProjectStore();
    const [form, setForm] = useState({ name: "", description: "" });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    // 모달이 열릴 때마다 폼 초기화
    useEffect(() => {
        if (open) {
            setForm({ name: "", description: "" });
            setError("");
        }
    }, [open]);

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // 폼 검증
    const validateForm = () => {
        if (!form.name.trim()) {
            setError("프로젝트 이름을 입력해주세요.");
            return false;
        }
        if (form.name.length > 50) {
            setError("프로젝트 이름은 50자 이하로 입력해주세요.");
            return false;
        }
        return true;
    };

    // 제출 핸들러
    const handleSubmit = async () => {
        if (!validateForm()) return;

        setSubmitting(true);
        const success = await createProject(form);
        setSubmitting(false);

        if (success) {
            onClose();
        }
    };

    // Enter로 제출 가능
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <BaseModal isOpen={open} onClose={onClose} title="새 프로젝트 생성">
            <div className="flex flex-col gap-4 mt-3">
                {/* 프로젝트 이름 */}
                <div>
                    <label className="block text-sm font-medium mb-1">프로젝트 이름</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className="w-full border border-base-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="예: 웹 개발 프로젝트"
                        disabled={submitting || isLoading}
                    />
                </div>

                {/* 설명 */}
                <div>
                    <label className="block text-sm font-medium mb-1">설명</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        rows={3}
                        className="w-full border border-base-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="프로젝트 설명을 입력하세요."
                        disabled={submitting || isLoading}
                    />
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <p className="text-red-500 text-xs mt-1">{error}</p>
                )}

                {/* 버튼 영역 */}
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        className="px-4 py-2 bg-gray-200 rounded-lg text-sm hover:bg-gray-300 disabled:opacity-50"
                        onClick={onClose}
                        disabled={submitting || isLoading}
                    >
                        취소
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${
                            submitting || isLoading
                                ? "bg-primary/60 cursor-not-allowed"
                                : "bg-primary hover:bg-primary/90"
                        }`}
                        onClick={handleSubmit}
                        disabled={submitting || isLoading}
                    >
                        {submitting || isLoading ? "생성 중..." : "생성"}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
}
