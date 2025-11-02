import React, { useState, useMemo } from "react";
import useChatStore from "@/store/chat/useChatStore.js";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SidebarChannelsMobile() {
    const {
        workspaces,
        channels,
        selectWorkspace,
        selectedWorkspace,
        selectedChannel,
        setChannel,
    } = useChatStore();


    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("workspace"); // "workspace" or "channel"

    const displayChannels = useMemo(() => {
        return channels.filter((ch) => ch.type !== "DIRECT" && ch.typeId !== 3);
    }, [channels]);

    const handleSelectWorkspace = (wk) => {
        selectWorkspace(wk);
        setActiveTab("channel");
    };

    const handleSelectChannel = (ch) => {
        setChannel(ch);
        setOpen(false);
    };

    return (
        <div className="relative bg-base-100 border-b border-base-300 z-20">
            {/* 상단 헤더 */}
            <div
                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                onClick={() => setOpen(!open)}
            >
                <div className="flex flex-col">
          <span className="text-sm font-semibold">
            {selectedWorkspace?.name || "워크스페이스"}
          </span>
                    <span className="text-xs text-base-content/70">
            #{selectedChannel?.name || "채널 선택"}
          </span>
                </div>
                {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {/* 드롭다운 */}
            <div
                className={`absolute left-0 right-0 bg-base-100 border-t border-base-300 overflow-hidden transition-all duration-300 ${
                    open ? "max-h-[22rem] shadow-md" : "max-h-0"
                }`}
            >
                {open && (
                    <div className="flex flex-col">
                        {/* 탭 */}
                        <div className="flex border-b border-base-300">
                            <button
                                className={`flex-1 py-2 text-sm font-medium ${
                                    activeTab === "workspace"
                                        ? "border-b-2 border-primary text-primary"
                                        : "text-base-content/70"
                                }`}
                                onClick={() => setActiveTab("workspace")}
                            >
                                워크스페이스
                            </button>
                            <button
                                className={`flex-1 py-2 text-sm font-medium ${
                                    activeTab === "channel"
                                        ? "border-b-2 border-primary text-primary"
                                        : "text-base-content/70"
                                }`}
                                onClick={() => setActiveTab("channel")}
                            >
                                채널
                            </button>
                        </div>

                        {/* 내용 */}
                        <div className="p-2 overflow-y-auto max-h-72">
                            {activeTab === "workspace" ? (
                                <>
                                    <h3 className="text-xs uppercase text-base-content/60 mb-2 pl-2">
                                        Workspaces
                                    </h3>
                                    <ul className="space-y-1">
                                        {workspaces.map((wk) => (
                                            <li
                                                key={wk.id}
                                                onClick={() => handleSelectWorkspace(wk)}
                                                className={`px-3 py-2 rounded-md cursor-pointer ${
                                                    selectedWorkspace?.id === wk.id
                                                        ? "bg-primary text-primary-content"
                                                        : "hover:bg-base-200"
                                                }`}
                                            >
                                                {wk.name}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xs uppercase text-base-content/60 mb-2 pl-2">
                                        Channels
                                    </h3>
                                    <ul className="space-y-1">
                                        {displayChannels.map((ch) => (
                                            <li
                                                key={ch.id}
                                                onClick={() => handleSelectChannel(ch)}
                                                className={`px-3 py-2 rounded-md cursor-pointer ${
                                                    selectedChannel?.id === ch.id
                                                        ? "bg-primary text-primary-content"
                                                        : "hover:bg-base-200"
                                                }`}
                                            >
                                                # {ch.name}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
