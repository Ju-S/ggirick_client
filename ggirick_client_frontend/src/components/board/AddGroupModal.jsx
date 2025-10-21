import { useState } from "react";

export default function AddGroupModal({ isOpen, onClose, onSubmit }) {
    const [groupData, setGroupData] = useState({ name: "", description: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGroupData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!groupData.name.trim() || !groupData.description.trim()) {
            alert("그룹명과 설명을 입력해주세요.");
            return;
        }
        onSubmit(groupData);
        setGroupData({ name: "", description: "" });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal modal-open">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">새 그룹 추가</h3>

                <label className="block mb-2 font-semibold">그룹명</label>
                <input
                    type="text"
                    name="name"
                    value={groupData.name}
                    onChange={handleChange}
                    placeholder="그룹명을 입력하세요"
                    className="input input-bordered w-full mb-4"
                />

                <label className="block mb-2 font-semibold">설명</label>
                <textarea
                    name="description"
                    value={groupData.description}
                    onChange={handleChange}
                    placeholder="그룹 설명을 입력하세요"
                    className="textarea textarea-bordered w-full mb-4"
                />

                <div className="modal-action">
                    <button className="btn btn-ghost" onClick={onClose}>취소</button>
                    <button className="btn btn-primary" onClick={handleSubmit}>추가</button>
                </div>
            </div>
        </div>
    );
}
