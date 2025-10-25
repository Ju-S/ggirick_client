import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import useChatStore from "@/store/chat/useChatStore.js";
import ChannelCreateModal from "@/components/chat/Modal/ChannelCreateModal.jsx";
import WorkspaceAddMemberModal from "@/components/chat/Modal/WorkspaceAddMemberModal.jsx";
import chatAPI from "@/api/chat/chatAPI.js";
import useEmployeeStore from "@/store/employeeStore.js";
import {getMyInfoAPI} from "@/api/mypage/employeeAPI.js";

export default function SidebarChannels() {

    const CHANNEL_TYPE_PRIVATE = "PRIVATE"
    const CHANNEL_TYPE_DIRECT = "DIRECT";

    const CHANNEL_TYPE_PUBLIC_CODE = 1;
    const CHANNEL_TYPE_PRIVATE_CODE = 2;
    const CHANNEL_TYPE_DIRECT_CODE  = 3;

    const MAX_CHANNELS = 30;

    const { channels, setChannel,selectedWorkspace, selectedWorkspaceMember,selectedChannel, selectedChannelMember  } = useChatStore();
    const [modalOpen, setModalOpen] = useState(false);
    const [addWorkspaceMemberModalOpen, setAddWorkspaceMemberModalOpen] = useState(false);

    const {selectedEmployee, setEmployee} = useEmployeeStore();

    useEffect(() => {
       if(selectedEmployee == null){
           getMyInfoAPI().then(resp => {
               setEmployee(resp.data)
           });
       }

    }, [selectedEmployee]);

    const handleDMClick = async (targetMember) => {
        if (!selectedWorkspace) return;
        const myId = JSON.parse(localStorage.getItem("user"))?.employeeId; // 로그인 사용자 id 가져오기
        const targetId = targetMember.employeeId;

        try {

            console.log("workspaceId:", selectedWorkspace.id, "targetId:", targetId);
            const dmChannel = await chatAPI.openOrCreateDMChannel(selectedWorkspace.id, targetId);

            if (dmChannel) {
                setChannel(dmChannel); // 기존 채널 클릭과 동일하게 동작
            } else {
                alert("DM 채널 생성 또는 조회 실패");
            }
        } catch (err) {
            console.error("DM 채널 생성 실패:", err);

            alert("서버 오류가 발생했습니다.");
        }
    };


    const handleCreateChannel = () => {
        const nonDmChannels = channels.filter((ch) => ch.type !== "dm");

        if (nonDmChannels.length >= MAX_CHANNELS) {
            alert(`채널은 최대 ${MAX_CHANNELS}개까지만 생성할 수 있습니다.`);
            return;
        }

        setModalOpen(true);
    };

    return (
    <>
        <aside className="flex w-32 md:w-64 flex-col border-r border-base-300 bg-base-100 text-base-content">
            {/* 상단 제목 영역 */}
            <div className="border-b border-base-300 p-4">
                <h2 className="text-lg font-semibold">{selectedWorkspace?.name || "워크스페이스 이름 선택"} </h2>
                <h5 className="text-sm">{selectedWorkspace?.description || ""} </h5>
                <div className="flex -space-x-2">
                    {Array.isArray(selectedWorkspaceMember) && selectedWorkspaceMember.some(m => !m.leftAt) ? (
                        selectedWorkspaceMember
                            .filter(m => !m.leftAt) // left_at이 없는 멤버만 표시
                            .map((m, i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content text-xs font-semibold border-2 border-base-100 shadow-sm"
                                >
                                    {m.name?.[0] || "?"}
                                </div>
                            ))
                    ) : (
                        <span className="text-xs opacity-70">멤버 없음</span>
                    )}
                </div>

                {selectedWorkspace &&  <div className="w-full">
                    <button
                        className="w-full px-4 py-2 bg-base-100 text-base-content rounded-lg text-sm font-medium hover:bg-base-200/80 transition-colors shadow-sm"
                        onClick={() => setAddWorkspaceMemberModalOpen(true)}
                    >
                        + 멤버 관리
                    </button>
                </div>}
            </div>


            {/* 네비게이션 */}
            <nav className="flex-1 overflow-y-auto px-4 py-2">
                {/* 채널 섹션 */}
                <h3 className="mb-2 text-xs uppercase text-base-content/70">Channels</h3>
                <ul className="space-y-1">
                    {channels
                        .filter((ch) => !(ch.typeId === CHANNEL_TYPE_DIRECT_CODE || ch.type === CHANNEL_TYPE_DIRECT))
                        .map((ch) => {
                        const isSelected = selectedChannel?.id === ch.id;
                        return (
                            <li
                                key={ch.id}
                                className={`px-2 py-1 cursor-pointer flex items-center justify-between rounded-md transition-colors
                                        ${
                                    isSelected
                                        ? "bg-primary text-primary-content shadow-sm font-semibold"
                                        : "bg-base-100 hover:bg-base-200"
                                }`}
                                onClick={() => setChannel(ch)}
                            >
                                <span># {ch.name}</span>
                                <button
                                    className={`btn btn-xs rounded-full hidden md:inline-flex ${
                                        isSelected ? "btn-accent" : "btn-secondary"
                                    }`}
                                >
                                    화상회의
                                </button>
                            </li>
                        );
                    })}
                    <li  className="px-2 py-1 bg-base-100 hover:bg-base-200 cursor-pointer flex items-center justify-between"
                         onClick={handleCreateChannel}
                    >
                        <span> + 채널 추가 </span>
                    </li>
                </ul>



                <h3 className="mt-4 mb-2 text-xs uppercase text-base-content/70">
                    Direct Messages
                </h3>
                <ul className="space-y-1">

                    {Array.isArray(selectedWorkspaceMember) && selectedWorkspaceMember.length > 0 ? (
                        selectedWorkspaceMember.filter(
                            m => m.employeeId !== selectedEmployee.id
                        ).map((m, i) => (
                            <li
                                key={"dm_member"+i}
                                className="cursor-pointer rounded-lg px-3 py-2 hover:bg-base-200"
                                onClick={() => handleDMClick(m)}>
                                @ {m.name}
                            </li>
                        ))
                    ) : (
                        <span className="text-xs opacity-70">멤버 없음</span>
                    )}
                </ul>
            </nav>
        </aside>

        <ChannelCreateModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
        />
        <WorkspaceAddMemberModal
            open={addWorkspaceMemberModalOpen}
            onClose={() =>setAddWorkspaceMemberModalOpen(false) }
        />
    </>
    );
}
