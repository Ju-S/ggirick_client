import React, {useState} from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import BaseModal from "@/components/common/BaseModal.jsx";


export function BlockActions({ onLike, onCopy,like, viewer,reactions, onAddReaction ,content}) {
    const [showPicker, setShowPicker] = useState(false);
    const [showReactionModal, setShowReactionModal] = useState(false);
    const [selectedReactionUsers, setSelectedReactionUsers] = useState([]);
    const [selectedReactionEmoji, setSelectedReactionEmoji] = useState("");
    // 클릭한 반응에 누가 눌렀는지 모달 띄우기
    const handleReactionClick = (reaction) => {
        setSelectedReactionUsers(reaction.users || []);
        setSelectedReactionEmoji(reaction.emoji); // 클릭한 이모지 저장
        setShowReactionModal(true);
    };


    const handleCopy = () => {
        onCopy(content);
    };


    return (
        <>  {/* 이모지 목록 표시 */}
            {showPicker && (
                <div className="absolute bottom-8 right-0 z-10 shadow-lg">
                    <Picker
                        data={data}
                        onEmojiSelect={(emoji) => {
                            onAddReaction(emoji.native);
                            setShowPicker(false);
                        }}
                        theme="light"
                        previewPosition="none"
                        perLine={8}
                    />
                </div>
            )}
            <div className="mt-1 text-xs flex justify-start space-x-2">
                {reactions && reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-1">
                        {reactions.map((r, i) => (
                            <span
                                key={i}
                                className="flex items-center space-x-1 bg-base-200 rounded-full px-2 py-0.5 text-sm cursor-pointer hover:bg-base-300"
                                onClick={() => handleReactionClick(r)}
                                title={`${r.users.join(", ")} 님이 ${r.emoji} 반응`}
                            >
              <span>{r.emoji}</span>
              <span className="text-xs text-base-content/70">
                {r.users.length}
              </span>
            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className="mt-1 text-xs flex justify-end space-x-2">
                <button className="hover:text-base-content/80" onClick={onLike}>👍 {like}</button>
                <button className="hover:text-base-content/80" >읽음 {viewer.length}</button>
                <button className="hover:text-base-content/80" onClick={handleCopy}>📋 복사하기</button>
                <button
                    className="bg-primary text-primary-content rounded-lg px-2"
                    onClick={() => setShowPicker(!showPicker)}
                >
                    반응 추가
                </button>
            </div>
            <BaseModal
                isOpen={showReactionModal}
                onClose={() => setShowReactionModal(false)}
                title={`해당 채팅에 '${selectedReactionEmoji}'라고 반응한 사람:`}
            >
                <ul>
                    {selectedReactionUsers.map((user, idx) => (
                        <li key={idx}>{user}</li>
                    ))}
                </ul>
            </BaseModal>
        </>
    );
}