// ChatRoom.jsx
import React, {useEffect, useRef, useCallback, useMemo, memo, useState} from "react";
import ChatInput from "./ChatInput";
import useChatStore from "../../store/chat/useChatStore.js";
import { useChatWebSocket } from "@/hooks/chat/useChatWebSocket.js";
import { Message as BaseMessage } from "@/components/chat/Message.jsx";
import ChatRoomHeader from "@/components/chat/ChatRoomHeader.jsx";
import ChannelFileDrawer from "@/components/chat/ChannelFileDrawer.jsx";
import { BlockNoteConverterProvider } from "@/providers/BlockNoteConverterProvider.jsx";
const Message = memo(BaseMessage);

export default function ChatRoom() {
    const {
        messages,
        loading,
        setLoading,
        addMessage,
        selectedWorkspace,
        selectedChannel,
        selectedChannelMember,
        selectedWorkspaceMember,
        fetchOldMessages,
        hasMoreMessages,
    } = useChatStore();

    const containerRef = useRef(null);
    const topRef = useRef(null);
    const bottomRef = useRef(null);
    const didInitialScroll = useRef(false);
    const prevMessagesLength = useRef(0);

    const memberMap = useMemo(() => {
        const map = new Map();
        selectedWorkspaceMember.forEach(m => map.set(m.employeeId, m));
        return map;
    }, [selectedWorkspaceMember]);

    const { sendMessage } = useChatWebSocket(
        selectedWorkspace?.id,
        selectedChannel?.id,
        (msg) => addMessage(msg)
    );


    useEffect(() => {
        if (!containerRef.current || messages.length === 0) return;

        if (!didInitialScroll.current) {
            bottomRef.current.scrollIntoView({ behavior: "instant" });
            didInitialScroll.current = true;
        } else if (messages.length > prevMessagesLength.current) {
            bottomRef.current.scrollIntoView({ behavior: "instant" });
        }

        prevMessagesLength.current = messages.length;
    }, [messages.length, selectedChannel?.id]);

    const loadOlderMessages = useCallback(async () => {
        if (!hasMoreMessages || messages.length === 0) return;

        const container = containerRef.current;
        setLoading(true);
        const oldScrollHeight = container.scrollHeight;

        await fetchOldMessages();

        container.scrollTop = container.scrollHeight - oldScrollHeight;
        setLoading(false);
    }, [hasMoreMessages, messages.length, fetchOldMessages, setLoading]);

    if (!selectedWorkspace || !selectedChannel) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-500">
                워크스페이스와 채널을 선택해주세요.
            </div>
        );
    }

    return (
        <main className="flex flex-1 flex-col bg-base-200 text-base-content pt-14  md:pt-0">
            <ChatRoomHeader  sendMessage={sendMessage}/>

            <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                <div ref={topRef}></div>


                {loading && (
                    <div className="flex flex-col items-center justify-center gap-2 p-4">
                        <div className="radial-progress animate-spin text-secondary" style={{ "--value": 70 }}> </div>
                        <span className="text-sm text-base-content/70">메시지 로딩중...</span>
                    </div>
                )}
                {!hasMoreMessages && messages.length >= 30  && (
                    <div className="text-center text-sm text-base-content-100">
                        더 불러올 메시지가 없습니다.
                    </div>
                )}
                {hasMoreMessages && messages.length >= 30 && (
                    <div className="text-center mb-2">
                        <button className="btn btn-sm btn-outline" onClick={loadOlderMessages}>
                            더 불러오기
                        </button>
                    </div>
                )}
                <BlockNoteConverterProvider>
                {messages.map(msg => {
                    if (msg.type === "user") {
                        return (
                            <div key={msg.id} data-msg-id={msg.id} className="flex items-start space-x-3">
                                <img
                                    src={
                                        memberMap.get(msg.senderId)?.profileUrl ||
                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderName || "User")}&background=random`
                                    }
                                    className="h-8 w-8 rounded-full"
                                    alt={msg.senderName || "Unknown"}
                                />
                                <Message
                                    key={msg.id}
                                    msg={msg}
                                    sendMessage={sendMessage}
                                    chatroom={true}

                                />
                            </div>
                        );
                    } else {
                        let contentText = "";
                        try {
                            const parsed = typeof msg.content === "string" ? JSON.parse(msg.content) : msg.content;
                            contentText = parsed.text || msg.content;
                        } catch(e) {
                            contentText = msg.content;
                        }

                        return (
                            <div key={msg.id} className="text-center text-xs text-base-content/50 italic">
                                {contentText}
                                <div className="text-[10px] text-gray-400">
                                    {msg.time}
                                </div>
                            </div>
                        );
                    }
                })}


                <div ref={bottomRef}></div>
                </BlockNoteConverterProvider>
            </div>

            <ChatInput onSend={sendMessage} />

        </main>

    );
}
