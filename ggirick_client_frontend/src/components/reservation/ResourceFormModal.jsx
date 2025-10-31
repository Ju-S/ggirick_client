import { useEffect, useState } from "react";
import useReservationStore from "../../store/reservation/useReservationStore";
import BaseModal from "../../components/common/BaseModal";
import { insertAPI, getResourceTypesAPI } from "@/api/reservation/resourceAPI.js";

export default function ResourceFormModal() {
    const { isResourceModalOpen, setResourceModalOpen, fetchResources } = useReservationStore();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        imgUrl: "",
        type: "", // 추가됨
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [resourceTypes, setResourceTypes] = useState([]); // 서버에서 불러올 타입 목록
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ✅ 모달 열릴 때 타입 목록 불러오기
    useEffect(() => {
        if (isResourceModalOpen) {
            fetchResourceTypes();
        }
    }, [isResourceModalOpen]);

    const fetchResourceTypes = async () => {
        try {
            const res = await getResourceTypesAPI();
            setResourceTypes(res.data);
        } catch (err) {
            console.error("Failed to fetch resource types:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name) {
            alert("리소스 이름을 입력해주세요.");
            return;
        }
        if (!formData.type) {
            alert("리소스 타입을 선택해주세요.");
            return;
        }

        const data = new FormData();
        data.append("data", new Blob([JSON.stringify(formData)], { type: "application/json" }));
        if (selectedFile) data.append("file", selectedFile);

        setIsSubmitting(true);
        try {
            await insertAPI(data);
            alert("리소스가 성공적으로 생성되었습니다.");
            setResourceModalOpen(false);
            await fetchResources();
            setFormData({ name: "", description: "", imgUrl: "", type: "" });
            setSelectedFile(null);
        } catch (error) {
            console.error("Resource creation failed:", error);
            alert("리소스 생성 중 오류가 발생했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <BaseModal isOpen={isResourceModalOpen} onClose={() => setResourceModalOpen(false)} title="새 리소스 생성">
            <form onSubmit={handleSubmit}>
                {/* 이름 */}
                <div className="form-control w-full mb-4">
                    <label className="label">
                        <span className="label-text">리소스 이름 *</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        required
                    />
                </div>

                {/* 타입 선택 */}
                <div className="form-control w-full mb-4">
                    <label className="label">
                        <span className="label-text">리소스 타입 *</span>
                    </label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="select select-bordered w-full"
                        required
                    >
                        <option value="">타입을 선택하세요</option>
                        {resourceTypes.map((t) => (
                            <option key={t.id} value={t.typecode}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 이미지 */}
                <div className="form-control w-full mb-4">
                    <label className="label">
                        <span className="label-text">이미지 파일 *</span>
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input file-input-bordered w-full"
                    />
                </div>

                {/* 설명 */}
                <div className="form-control w-full mb-4">
                    <label className="label">
                        <span className="label-text">설명</span>
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="textarea textarea-bordered"
                        placeholder="회의실 위치, 장비 목록 등"
                    />
                </div>

                {/* 버튼 */}
                <div className="modal-action justify-end">
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? <span className="loading loading-spinner"></span> : "생성"}
                    </button>
                    <button type="button" className="btn" onClick={() => setResourceModalOpen(false)}>
                        취소
                    </button>
                </div>
            </form>
        </BaseModal>
    );
}
