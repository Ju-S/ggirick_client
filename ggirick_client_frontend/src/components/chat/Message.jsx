import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { BlockActions } from "@/components/chat/BlockAction.jsx";
import React from "react";
import useChatStore from "@/store/chat/useChatStore.js";

export function Message({ msg, like, viewer, reactions, onAddReaction, sendMessage }) {
    const { addReaction,selectedWorkspace,selectedChannel} = useChatStore();

    // 메시지 전용 읽기 전용 editor 인스턴스 생성
    const editor = useCreateBlockNote({
        initialContent: msg.content || [{ type: "paragraph", content: [] }],
    });

    // 좋아요 클릭
    const handleLike = () => {

        sendMessage({ type: "like", parentId: msg.id })
    };

    // 복사 기능
    const handleCopy = (contentToCopy) => {
        if (!contentToCopy) return;

        const plainText = contentToCopy
            .map((block) => block.content?.map((inline) => inline.text).join("") || "")
            .filter((t) => t.length > 0)
            .join("\n");

        if (navigator.clipboard) {
            navigator.clipboard
                .writeText(plainText)
                .then(() => alert("메시지가 클립보드에 복사되었습니다."))
                .catch((err) => alert("복사 실패: " + err));
        } else {
            alert("Clipboard API를 지원하지 않아 복사가 불가능합니다.");
        }
    };

    return (
        <div className="w-full bg-base-100 rounded-lg p-2 shadow-sm">
            <div className="text-sm text-base-content/50 mb-1">
                {msg.senderName || msg.sender} • {msg.time}
            </div>

            {/* BlockNote 읽기 전용 렌더링 */}
            <div className="w-full blocknote-content">
                <BlockNoteView editor={editor} className="w-full" editable={false} />
            </div>

            <BlockActions
                onLike={handleLike}
                onCopy={handleCopy}
                like={msg.like || 0}
                viewer={viewer || []}
                reactions={reactions || []}
                content={msg.content || []}
                onAddReaction={(emoji) => {
                    sendMessage({
                        type: "emoji",
                        parentId: msg.id,
                        emoji,
                    });
                }}
            />
        </div>
    );
}
