import {useCreateBlockNote} from "@blocknote/react";
import {BlockNoteView} from "@blocknote/mantine";
import {BlockActions} from "@/components/chat/BlockAction.jsx";
import React from "react";

export function Message({ msg,like, viewer, reactions,onAddReaction }) {
    // 메시지 전용 읽기 전용 editor 인스턴스 생성
    const editor = useCreateBlockNote({
        initialContent: msg.content,

    });

    // 블록 단위 상호작용 예시
    const handleLike = () => alert(`좋아요! (Message ID: ${msg.id})`);


    const handleCopy = (contentToCopy) => {
        console.log(contentToCopy)
        if (!contentToCopy) return;

        const plainText = contentToCopy
            .map(block => block.content?.map(inline => inline.text).join("") || "")
            .filter(t => t.length > 0)
            .join("\n");

        if (navigator.clipboard) {
            navigator.clipboard.writeText(plainText)
                .then(() => alert("메시지가 클립보드에 복사되었습니다."))
                .catch(err => alert("복사 실패: " + err));
        } else {
            alert("Clipboard API를 지원하지 않아 복사가 불가능합니다.");
        }
    };



    return (
        <div className="w-full bg-base-100 rounded-lg p-2 shadow-sm">
            <div className="text-sm text-base-content/50 mb-1">
                {msg.sender} • {msg.time}
            </div>

            {/* BlockNote 읽기 전용 렌더링 */}
            <div className="w-full blocknote-content">
                <BlockNoteView editor={editor} className="w-full" editable={false}/>
            </div>

            <BlockActions onLike={handleLike} onCopy={handleCopy} like={like} viewer={viewer} reactions = {reactions}  onAddReaction={(emoji) => onAddReaction(msg.id, emoji)}  content={msg.content}  />
        </div>
    );
}