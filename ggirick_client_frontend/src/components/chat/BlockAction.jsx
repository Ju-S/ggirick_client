import React, {useEffect, useState} from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import BaseModal from "@/components/common/BaseModal.jsx";
import useChatStore from "@/store/chat/useChatStore.js";

export function BlockActions({ onLike, onCopy, like = 0, viewer = [], reactions = [], onAddReaction, content = [] }) {
    const [showPicker, setShowPicker] = useState(false);
    const [showReactionModal, setShowReactionModal] = useState(false);
    const [selectedReactionUsers, setSelectedReactionUsers] = useState([]);
    const [selectedReactionEmoji, setSelectedReactionEmoji] = useState("");

    const [likeAnim, setLikeAnim] = useState(false);
    const [prevLike, setPrevLike] = useState(like);

    const {selectedChannelMember} = useChatStore();

    useEffect(() => {
        if (like > prevLike) {
            setLikeAnim(true);
            setTimeout(() => setLikeAnim(false), 800);
        }
        setPrevLike(like);
    }, [like]);

    // 클릭한 반응에 누가 눌렀는지 모달 띄우기
    const handleReactionClick = (reaction) => {
        console.log(reactions)
        const detailedUsers = reaction.users
            .map((userId) => {
                const member = selectedChannelMember.find(m => m.employeeId === userId);
                return member
                    ? { id: member.employeeId, name: member.name }
                    : { id: userId, name: userId }; // fallback
            });

        setSelectedReactionUsers(detailedUsers);
        setSelectedReactionEmoji(reaction.emoji || []);
        setShowReactionModal(true);

    };

    const handleCopyClick = () => {
        if (onCopy) onCopy(content);

    };

    const handleLikeClick = () =>{
        if (onLike) onLike();

    }

    return (
        <>
            {/* 이모지 선택 */}
            {showPicker && (
                <div
                    className="fixed inset-0 z-20 flex items-center justify-center bg-black/30"
                    onClick={() => setShowPicker(false)} // 배경 클릭 시 닫기
                >
                    <div
                        className="shadow-lg bg-base-100 text-base-content rounded-md"
                        onClick={(e) => e.stopPropagation()} // Picker 클릭 시 닫히지 않도록
                    >
                        <Picker
                            data={data}
                            onEmojiSelect={(emoji) => {
                                if (onAddReaction) onAddReaction(emoji.native);
                                setShowPicker(false);
                            }}
                            theme="light"
                            previewPosition="none"
                            perLine={8}
                        />
                    </div>
                </div>
            )}

            {/* 반응 목록 */}
            {reactions.length > 0 && (
                <div className="mt-1 text-xs flex flex-wrap gap-1 mb-1">
                    {reactions.map((r, i) => (
                        <span
                            key={i}
                            className="flex items-center space-x-1 bg-base-200 rounded-full px-2 py-0.5 text-sm cursor-pointer hover:bg-base-300"
                            onClick={() => handleReactionClick(r)}
                            title={`${r.users?.join(", ") || ""} 님이 ${r.emoji} 반응`}
                        >
              <span>{r.emoji}</span>
              <span className="text-xs text-base-content/70">{r.users?.length || 0}</span>
            </span>
                    ))}
                </div>
            )}

            {/* 액션 버튼 */}
            <div className="mt-1 text-xs flex justify-end space-x-2">
                <button
                    className={`relative px-2 py-1 rounded-lg transition-transform duration-300 ${
                        likeAnim ? "scale-125" : ""
                    }`}
                    onClick={handleLikeClick}
                >
                    👍 {like}
                    {likeAnim && (
                        <span className="absolute -top-2 -right-2 text-lg animate-ping text-yellow-400">✨</span>
                    )}
                </button>
                <button className="hover:text-base-content/80">
                    읽음 {viewer.length || 0}
                </button>
                <button className="hover:text-base-content/80" onClick={handleCopyClick}>
                    📋 복사하기
                </button>
                <button
                    className="bg-primary text-primary-content rounded-lg px-2"
                    onClick={() => setShowPicker(!showPicker)}
                >
                    반응 추가
                </button>
            </div>

            {/* 반응 모달 */}
            <BaseModal
                isOpen={showReactionModal}
                onClose={() => setShowReactionModal(false)}
                title={`해당 채팅에 '${selectedReactionEmoji}'라고 반응한 사람:`}
            >
                <ul>
                    {selectedReactionUsers.map((user, idx) => (
                        <li key={user.id}>{user.name}</li>
                    ))}
                </ul>

            </BaseModal>
        </>
    );
}
