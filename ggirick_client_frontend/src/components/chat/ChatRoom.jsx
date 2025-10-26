// ChatRoom.jsx
import React, {useEffect, useRef, useCallback, useMemo, memo, useState} from "react";
import ChatInput from "./ChatInput";
import useChatStore from "../../store/chat/useChatStore.js";
import { useChatWebSocket } from "@/hooks/chat/useChatWebSocket.js";
import { Message as BaseMessage } from "@/components/chat/Message.jsx";
import ChatRoomHeader from "@/components/chat/ChatRoomHeader.jsx";
import ChannelFileDrawer from "@/components/chat/ChannelFileDrawer.jsx";

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
        selectedChannelMember.forEach(m => map.set(m.employeeId, m));
        return map;
    }, [selectedChannelMember]);

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
        <main className="flex flex-1 flex-col bg-base-200 text-base-content">
            <ChatRoomHeader />
            <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                <div ref={topRef}></div>


                {loading && messages.length === 0 && (
                    <div className="inset-0 flex items-center justify-center bg-base-200 z-50">
                        메시지 로딩중...
                        <progress className="progress w-56 progress-primary" value="40" max="100" />
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

                {messages.map(msg =>
                    msg.type === "user" ? (
                        <div key={msg.id} data-msg-id={msg.id} className="flex items-start space-x-3">
                            <img
                                src={memberMap.get(msg.senderId)?.profileUrl || "https://flowbite.com/docs/images/people/profile-picture-1.jpg"}
                                className="h-8 w-8 rounded-full"
                                alt={msg.senderName}
                            />
                            <Message
                                key={msg.id}
                                msg={msg}
                                like={msg.like}
                                viewer={msg.viewer}
                                reactions={msg.reactions}
                                sendMessage={sendMessage}
                            />
                        </div>
                    ) : (
                        <div key={msg.id} className="text-center text-xs text-base-content/50 italic">
                            {msg.text}
                        </div>
                    )
                )}

                <div ref={bottomRef}></div>
            </div>

            <ChatInput onSend={sendMessage} />

        </main>

    );
}
