import React, {useEffect, useState} from "react";
import BaseModal from "@/components/common/BaseModal.jsx";
import {formatDate} from "@/utils/task/formatDate.js";
import useChatStore from "@/store/chat/useChatStore.js";
import chatAPI from "@/api/chat/chatAPI.js";

export default function ChannelSettingModal({ open, onClose}) {

    const { selectedWorkspace, selectedChannel,updateSelectedChannel} = useChatStore();

    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState({
        name: selectedChannel?.name || "",
        description: selectedChannel?.description || "",
    });
    useEffect(() => {
        if (selectedChannel) {
            setForm({
                name: selectedChannel.name || "",
                description: selectedChannel.description || "",
            });
        }
    }, [selectedChannel]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!form.name.trim()) {
            alert("채널 이름을 입력해주세요");
            return;
        }

        if (!form.description.trim()) {
            alert("채널 설명을 입력해주세요");
            return;
        }

        setIsSaving(true);
        try {
            await chatAPI.updateChannel( selectedWorkspace.id, selectedChannel.id, form);
            updateSelectedChannel(form);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };



    return (
        <BaseModal isOpen={open} onClose={onClose} title="채널 관리">
            <div className="flex flex-col gap-3">
                <label className="form-control w-full">
                    <span className="label-text text-sm">채널 이름</span>
                    <input
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        className="input input-bordered w-full"
                        placeholder="채널 이름을 입력하세요"
                    />
                </label>

                <label className="form-control w-full">
                    <span className="label-text text-sm">설명</span>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        className="textarea textarea-bordered w-full"
                        placeholder="채널 설명을 입력하세요"
                    />
                </label>
                <div>
                    <p>채널 종류: {selectedChannel.type}</p>
                </div>
                <div>
                    <p>채널 생성일: { formatDate(selectedChannel.createdAt)}</p>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="btn btn-sm btn-ghost">
                        취소
                    </button>
                    <button onClick={handleSave} disabled={isSaving} className="btn btn-sm btn-primary">
                        {isSaving ? "저장 중..." : "저장"}
                    </button>
                </div>
            </div>
        </BaseModal>
    );
}
