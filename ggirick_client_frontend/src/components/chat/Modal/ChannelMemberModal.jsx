import React, { useEffect, useState } from "react";
import BaseModal from "@/components/common/BaseModal.jsx";
import chatAPI from "@/api/chat/chatAPI.js";
import useChatStore from "@/store/chat/useChatStore.js";
import useEmployeeStore from "@/store/hr/employeeStore.js";
import {useNavigate} from "react-router";


export default function ChannelMemberModal({ open, onClose, channel,sendSystemMessage }) {
    const {
        selectedWorkspace,
        selectedChannelMember,
        selectedWorkspaceMember,
        setSelectedChannelMember,
       setSelectedChannel,
        fetchWorkspace
    } = useChatStore();

    const {selectedEmployee} = useEmployeeStore();
    const navigate = useNavigate();

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

            sendSystemMessage( "채널 멤버가 업데이트되었습니다.", "CHANNEL_MEMBERS_UPDATED");
            onClose();
        } catch (err) {
            console.error("채널 멤버 동기화 실패:", err);
        }
    };

    async function handleLeave() {
        if (!selectedEmployee?.id || !members?.current) return;

        // 현재 채널 멤버 중 본인만 제외
        const memberIds = members.current
            .filter((m) => m.employeeId !== selectedEmployee.id) // 제외 먼저
            .map((m) => m.employeeId); // 그 다음 id만 추출

        console.log("본인 제외한 멤버 ID 목록:", memberIds);

        let yes = true;
        if(memberIds.length === 0){
            yes =  confirm("현재 방에서 나가게 된다면 해당 채널은 삭제 됩니다. 그래도 괜찮습니까?");

        }

        if(yes){
            // 서버에 새로운 멤버 리스트를 동기화
             await chatAPI.syncChannelMembers(selectedWorkspace.id, channel.id, memberIds);

            alert("방에서 탈퇴했습니다.");
            setSelectedChannel(null);
            window.location.reload();
        }


    }


    const renderList = (list, type) => (
        <ul className="border p-2 rounded min-h-[100px] bg-base-100 space-y-1">
            {list.map((m) => (
                <li
                    key={m.employeeId}
                    className="flex justify-between items-center p-1 bg-base-200 rounded"
                >
                    <span>{m.name}</span>

                    {m.name=== selectedEmployee.name ? (
                        // 본인일 때: 탈퇴 버튼
                        <button
                            onClick={handleLeave}
                            className="text-xs text-error hover:underline"
                        >
                            탈퇴
                        </button>
                    ) : type === "current" ? (
                        // 현재 멤버 리스트: 제거 버튼
                        <button
                            onClick={() => removeMember(m)}
                            className="text-xs text-error hover:underline"
                        >
                            -
                        </button>
                    ) : (
                        // 추가 가능한 리스트: 추가 버튼
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
