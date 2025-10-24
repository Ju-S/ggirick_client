import React, {useState} from "react";
import { Link } from "react-router-dom";
import useChatStore from "@/store/chat/useChatStore.js";
import ChannelCreateModal from "@/components/chat/ChannelCreateModal.jsx";

export default function SidebarChannels() {

    const { channels, setChannel,selectedWorkspace, selectedWorkspaceMember, selectedChannelMember  } = useChatStore();
    const [modalOpen, setModalOpen] = useState(false);

    return (
    <>
        <aside className="flex w-32 md:w-64 flex-col border-r border-base-300 bg-base-100 text-base-content">
            {/* 상단 제목 영역 */}
            <div className="border-b border-base-300 p-4">
                <h2 className="text-lg font-semibold">{selectedWorkspace?.name || "워크스페이스 이름 선택"} </h2>
                <h5 className="text-sm">{selectedWorkspace?.description || ""} </h5>
                <div className="flex -space-x-2">
                    {Array.isArray(selectedWorkspaceMember) && selectedWorkspaceMember.length > 0 ? (
                        selectedWorkspaceMember.map((m, i) => (
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
            </div>


            {/* 네비게이션 */}
            <nav className="flex-1 overflow-y-auto px-4 py-2">
                {/* 채널 섹션 */}
                <h3 className="mb-2 text-xs uppercase text-base-content/70">Channels</h3>
                <ul className="space-y-1">
                    {channels.map((ch) => (
                        <li
                            key={ch.id}
                            className="px-2 py-1 bg-base-100 hover:bg-base-200 cursor-pointer flex items-center justify-between"
                            onClick={() => setChannel(ch)}
                        >
                            <span># {ch.name}</span>
                            <button className="btn btn-xs btn-primary rounded-full hidden md:inline-flex">
                                화상회의
                            </button>
                        </li>
                    ))}
                    <li  className="px-2 py-1 bg-base-100 hover:bg-base-200 cursor-pointer flex items-center justify-between"
                         onClick={() => setModalOpen(true)}
                    >
                        <span> + 채널 추가 </span>
                    </li>
                </ul>


                {/* DM 섹션: 텍스트만 있으므로 그대로 유지해도 무방함 */}
                <h3 className="mt-4 mb-2 text-xs uppercase text-base-content/70">
                    Direct Messages
                </h3>
                <ul className="space-y-1">

                    {Array.isArray(selectedWorkspaceMember) && selectedWorkspaceMember.length > 0 ? (
                        selectedWorkspaceMember.map((m, i) => (
                            <li className="cursor-pointer rounded-lg px-3 py-2 hover:bg-base-200">
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
    </>
    );
}
