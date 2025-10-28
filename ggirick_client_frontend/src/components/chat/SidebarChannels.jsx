import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import useChatStore from "@/store/chat/useChatStore.js";
import ChannelCreateModal from "@/components/chat/Modal/ChannelCreateModal.jsx";
import WorkspaceAddMemberModal from "@/components/chat/Modal/WorkspaceAddMemberModal.jsx";
import chatAPI from "@/api/chat/chatAPI.js";
import useEmployeeStore from "@/store/hr/employeeStore.js";
import { getMyInfoAPI } from "@/api/mypage/employeeAPI.js";
import WorkspaceSettingModal from "@/components/chat/Modal/WorkspaceSettingModal.jsx";

export default function SidebarChannels() {
    const CHANNEL_TYPE_DIRECT = "DIRECT";
    const CHANNEL_TYPE_DIRECT_CODE = 3;
    const MAX_CHANNELS = 30;

    const {
        channels,
        setChannel,
        selectedWorkspace,
        selectedWorkspaceMember,
        selectedChannel,
        workspaceRole
    } = useChatStore();

    const { selectedEmployee, setEmployee } = useEmployeeStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [workspaceSettingOpen, setWorkspaceSettingOpen] = useState(false);
    const [addWorkspaceMemberModalOpen, setAddWorkspaceMemberModalOpen] = useState(false);

    const canEdit = workspaceRole === "OWNER" || workspaceRole === "ADMIN";
    //사용자 정보는 최초 1회 가져오기
    useEffect(() => {
        if (!selectedEmployee?.id) {
            getMyInfoAPI()
                .then(resp => setEmployee(resp.data))
                .catch(err => console.error("내 정보 조회 실패:", err));
        }
    }, [selectedEmployee, setEmployee]);

   //필터링 된 채널 목록도 매모
    const displayChannels = useMemo(() => {
        return channels.filter(
            ch => !(ch.typeId === CHANNEL_TYPE_DIRECT_CODE || ch.type === CHANNEL_TYPE_DIRECT)
        );
    }, [channels]);

  //활성 멤버는 memo
    const activeMembers = useMemo(() => {
        return selectedWorkspaceMember?.filter(m => !m.leftAt) ?? [];
    }, [selectedWorkspaceMember]);


    const handleDMClick = useCallback(async (targetMember) => {
        if (!selectedWorkspace || !targetMember) return;

        const targetId = targetMember.employeeId;


        try {
            console.log("workspaceId:", selectedWorkspace.id, "targetId:", targetId);
            const dmChannel = await chatAPI.openOrCreateDMChannel(selectedWorkspace.id, targetId);
            if (dmChannel) {
                setChannel(dmChannel);
            } else {
                alert("DM 채널 생성 또는 조회 실패");
            }
        } catch (err) {
            console.error("DM 채널 생성 실패:", err);
            alert("서버 오류가 발생했습니다.");
        }
    }, [selectedWorkspace, setChannel]);

    /** 채널 생성 핸들러 */
    const handleCreateChannel = useCallback(() => {
        const nonDmChannels = channels.filter((ch) => ch.type !== "dm");
        if (nonDmChannels.length >= MAX_CHANNELS) {
            alert(`채널은 최대 ${MAX_CHANNELS}개까지만 생성할 수 있습니다.`);
            return;
        }
        setModalOpen(true);
    }, [channels]);

    return (
        <>
            <aside className="flex w-32 md:w-64 flex-col border-r border-base-300 bg-base-100 text-base-content">
                {/* 상단 제목 */}
                <div className="border-b border-base-300 p-4 space-y-3">
                    {/* 제목과 설명 */}
                    <div>
                        <h2 className="text-lg font-semibold">
                            {selectedWorkspace?.name || "워크스페이스 선택"}
                        </h2>
                        <h5 className="text-sm text-base-content/70 mt-1">
                            {selectedWorkspace?.description || ""}
                        </h5>
                    </div>

                    {/* 멤버 목록 */}
                    <div className="flex -space-x-2 items-center">
                        {activeMembers.length > 0 ? (
                            activeMembers.map((m, i) => (
                                <div
                                    key={m.employeeId || i}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-primary-content text-xs font-semibold border-2 border-base-100 shadow-sm"
                                >
                                    {m.name?.[0] || "?"}
                                </div>
                            ))
                        ) : (
                            <span className="text-xs opacity-70">멤버 없음</span>
                        )}
                    </div>

                    {/* 버튼 그룹 */}
                    <div className="flex flex-col gap-2 pt-2">
                        {selectedWorkspace && (
                            <button
                                className="w-full px-4 py-2 bg-base-100 text-base-content rounded-lg text-sm font-medium hover:bg-base-200/80 transition-colors shadow-sm"
                                onClick={() => setAddWorkspaceMemberModalOpen(true)}
                            >
                                + 멤버 관리
                            </button>
                        )}

                        {canEdit && (
                            <button
                                onClick={() => setWorkspaceSettingOpen(true)}
                                className="w-full px-4 py-2 bg-base-100 text-base-content rounded-lg text-sm font-medium hover:bg-base-200/80 transition-colors shadow-sm"
                            >
                                워크스페이스 관리
                            </button>
                        )}
                    </div>
                </div>


                {/* 채널 목록 */}
                <nav className="flex-1 overflow-y-auto px-4 py-2">
                    <h3 className="mb-2 text-xs uppercase text-base-content/70">Channels [{displayChannels.length}]</h3>
                    <ul className="space-y-1">
                        {displayChannels.map((ch) => {
                            const isSelected = selectedChannel?.id === ch.id;
                            return (
                                <li
                                    key={ch.id}
                                    className={`px-2 py-1 cursor-pointer flex items-center justify-between rounded-md transition-colors
                                        ${isSelected
                                        ? "bg-primary text-primary-content shadow-sm font-semibold"
                                        : "bg-base-100 hover:bg-base-200"
                                    }`}
                                    onClick={() => setChannel(ch)}
                                >
                                    <span># {ch.name}</span>
                                    <button
                                        className={`btn btn-xs rounded-full hidden md:inline-flex ${isSelected ? "btn-accent" : "btn-secondary"}`}
                                    >
                                        화상회의
                                    </button>
                                </li>
                            );
                        })}
                        <li
                            className="px-2 py-1 bg-base-100 hover:bg-base-200 cursor-pointer flex items-center justify-between"
                            onClick={handleCreateChannel}
                        >
                            <span> + 채널 추가 </span>
                        </li>
                    </ul>

                    {/* DM 목록 */}
                    <h3 className="mt-4 mb-2 text-xs uppercase text-base-content/70">Direct Messages</h3>
                    <ul className="space-y-1">
                        {activeMembers.length > 0 ? (
                            activeMembers
                                .filter(m => m.employeeId !== selectedEmployee?.id)
                                .map((m, i) => (
                                    <li
                                        key={"dm_member_" + i}
                                        className="cursor-pointer rounded-lg px-3 py-2 hover:bg-base-200"
                                        onClick={() => handleDMClick(m)}
                                    >
                                        @ {m.name}
                                    </li>
                                ))
                        ) : (
                            <span className="text-xs opacity-70">멤버 없음</span>
                        )}
                    </ul>
                </nav>
            </aside>

            {/* 모달 */}
            <ChannelCreateModal open={modalOpen} onClose={() => setModalOpen(false)} />
            <WorkspaceAddMemberModal open={addWorkspaceMemberModalOpen} onClose={() => setAddWorkspaceMemberModalOpen(false)} />
            <WorkspaceSettingModal open={workspaceSettingOpen} onClose={() => setWorkspaceSettingOpen(false)} />
        </>
    );
}
