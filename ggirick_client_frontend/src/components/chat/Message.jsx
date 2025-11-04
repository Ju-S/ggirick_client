import React, { useEffect, useState } from "react";
import { BlockActions } from "@/components/chat/BlockAction.jsx";
import useChatStore from "@/store/chat/useChatStore.js";
import {useBlockNoteConverter} from "@/providers/BlockNoteConverterProvider.jsx";

export function Message({ msg, viewer, reactions, sendMessage, chatroom }) {
    const { addReaction, selectedWorkspace, selectedChannel } = useChatStore();
    const { convertBlocksToHTML } = useBlockNoteConverter();

    const [htmlContent, setHtmlContent] = useState("<p>로딩중...</p>");

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const blocks = msg.content || [{ type: "paragraph", content: [] }];
                const html = await convertBlocksToHTML(blocks);
                if (mounted) setHtmlContent(html);
            } catch (err) {
                console.error("문서 변환 에러:", err);
                if (mounted) setHtmlContent("<p>메시지를 불러올 수 없습니다.</p>");
            }
        })();
        return () => {
            mounted = false;
        };
    }, [msg.content, convertBlocksToHTML]);

    // 좋아요, 읽음, 복사 등 기존 핸들러 유지
    const handleLike = () => {
        sendMessage({ type: "like", parentId: msg.id });
    };
    const handleViewer = () => {
        sendMessage({ type: "viewer", parentId: msg.id });
    };
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

            {/* 변환된 HTML 출력 (빠름) */}
            <div
                className="w-full blocknote-content prose max-w-none text-sm text-base-content"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {chatroom && (
                <BlockActions
                    onLike={handleLike}
                    onCopy={handleCopy}
                    onViewer={handleViewer}
                    like={msg.like || 0}
                    likeUsers={msg.likeUsers || []}
                    viewer={msg.viewer || []}
                    reactions={msg.reactions || []}
                    content={msg.content || [{ type: "paragraph", content: [{ type: "text", text: "" }] }]}
                    onAddReaction={(emoji) => {
                        sendMessage({
                            type: "emoji",
                            parentId: msg.id,
                            emoji,
                        });
                    }}
                />
            )}
        </div>
    );
}
