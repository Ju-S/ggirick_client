import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import ChatInput from "./ChatInput";
import useChatStore from "../../store/chat/useChatStore.js";
import { useChatWebSocket } from "@/hooks/chat/useChatWebSocket.js";
import { Message as BaseMessage } from "@/components/chat/Message.jsx";
import ChatRoomHeader from "@/components/chat/ChatRoomHeader.jsx";

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



    const { sendMessage } = useChatWebSocket(
        selectedWorkspace?.id,
        selectedChannel?.id,
        (msg) => addMessage(msg)
    );


    const prevMessagesLength = useRef(0);

    useEffect(() => {
        if (!containerRef.current || messages.length === 0) return;

        // 최초 진입 시 하단으로 스크롤
        if (!didInitialScroll.current) {
            bottomRef.current.scrollIntoView({ behavior: "instant" });
            didInitialScroll.current = true;
        }
        // 이후 새 메시지가 추가될 때만 스크롤
        else if (messages.length > prevMessagesLength.current) {
            bottomRef.current.scrollIntoView({ behavior: "instant" });
        }

        prevMessagesLength.current = messages.length;
    }, [messages, selectedChannel]);


    // 이전 메시지 불러오기 (실제 요청)
    const loadOlderMessages = useCallback(async () => {

        if (!hasMoreMessages || messages.length === 0) return;

        const container = containerRef.current;

        setLoading(true);

        const oldScrollHeight = container.scrollHeight;
        await fetchOldMessages();

        // 스크롤 위치 유지
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
            <ChatRoomHeader/>
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                <div ref={topRef}></div>

                {loading && messages.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-200 z-50">
                        <progress className="progress w-56 progress-primary" value="40" max="100" />
                    </div>
                )}

                {loading && messages.length > 0 && (
                    <div className="text-center py-4 text-gray-500 sticky top-0 bg-base-100 border-b border-base-200">
                        <svg
                            className="animate-spin h-5 w-5 text-primary-500 inline-block mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042
1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        이전 메시지를 불러오는 중...
                    </div>
                )}

                {!hasMoreMessages && messages.length >= 30  && (
                    <div className="text-center text-sm text-base-content-100">
                        더 불러올 메시지가 없습니다.
                    </div>
                )}
                {/* 이전 메시지 더 불러오기 버튼 */}
                {hasMoreMessages && messages.length >= 30  &&(
                    <div className="text-center mb-2">
                        <button
                            className="btn btn-sm btn-outline"
                            onClick={loadOlderMessages}
                        >
                            더 불러오기
                        </button>
                    </div>
                )}
                {messages.map((msg) =>
                    msg.type === "user" ? (
                        <div key={msg.id} data-msg-id={msg.id} className="flex items-start space-x-3">
                            <img
                                src={
                                    selectedChannelMember.find((m) => m.employeeId === msg.senderId)?.profileUrl ||
                                    "https://flowbite.com/docs/images/people/profile-picture-1.jpg"
                                }
                                className="h-8 w-8 rounded-full"
                                alt={msg.senderName}
                            />
                            <Message
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
