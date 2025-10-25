import React, { useEffect, useState } from "react";
import BaseModal from "@/components/common/BaseModal.jsx";
import chatAPI from "@/api/chat/chatAPI.js";
import useChatStore from "@/store/chat/useChatStore.js";

export default function ChannelMemberModal({ open, onClose, channel }) {
    const {
        selectedWorkspace,
        selectedChannelMember,
        selectedWorkspaceMember,
        setSelectedChannelMember,
    } = useChatStore();

    const [members, setMembers] = useState({ current: [], available: [] });

    useEffect(() => {
        setMembers({
            current: selectedChannelMember || [],
            available: (selectedWorkspaceMember || []).filter(
                (wm) => !selectedChannelMember?.some((cm) => cm.employeeId === wm.employeeId)
            ),
        });
    }, [selectedChannelMember, selectedWorkspaceMember, open]);

    const addMember = (member) => {
        setMembers((prev) => ({
            current: [...prev.current, member],
            available: prev.available.filter((m) => m.employeeId !== member.employeeId),
        }));
    };

    const removeMember = (member) => {
        setMembers((prev) => ({
            current: prev.current.filter((m) => m.employeeId !== member.employeeId),
            available: [...prev.available, member],
        }));
    };

    const handleSave = async () => {
        try {
            const memberIds = members.current.map((m) => m.employeeId);
            await chatAPI.syncChannelMembers(selectedWorkspace.id, channel.id, memberIds);
            setSelectedChannelMember(members.current);
            onClose();
        } catch (err) {
            console.error("채널 멤버 동기화 실패:", err);
        }
    };

    const renderList = (list, type) => (
        <ul className="border p-2 rounded min-h-[100px] bg-base-100 space-y-1">
            {list.map((m) => (
                <li
                    key={m.employeeId}
                    className="flex justify-between items-center p-1 bg-base-200 rounded"
                >
                    <span>{m.name}</span>
                    {type === "current" ? (
                        <button
                            onClick={() => removeMember(m)}
                            className="text-xs text-error hover:underline"
                        >
                            -
                        </button>
                    ) : (
                        <button
                            onClick={() => addMember(m)}
                            className="text-xs text-primary hover:underline"
                        >
                            +
                        </button>
                    )}
                </li>
            ))}
            {list.length === 0 && <li className="text-sm text-base-content/60">없음</li>}
        </ul>
    );

    return (
        <BaseModal isOpen={open} onClose={onClose} title={`#${channel?.name} 멤버 관리`}>
            <div className="flex gap-4">
                <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-2">현재 멤버</h4>
                    {renderList(members.current, "current")}
                </div>
                <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-2">추가 가능한 멤버</h4>
                    {renderList(members.available, "available")}
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <button onClick={onClose} className="btn btn-sm btn-ghost">
                    취소
                </button>
                <button onClick={handleSave} className="btn btn-sm btn-primary">
                    저장
                </button>
            </div>
        </BaseModal>
    );
}
