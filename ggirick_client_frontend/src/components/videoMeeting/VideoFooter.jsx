import {useLivekitStore} from "@/store/chat/useLivekitStore.js";
import {useEffect, useState} from "react";

import { motion, AnimatePresence } from "framer-motion";
import {useNavigate} from "react-router-dom";
export default function VideoFooter({handleChatSidebar}) {

    const {
        room,
        localVideoTrack,
        toggleMic,
        toggleCamera,
        leaveRoom,
        micEnabled,
        cameraEnabled,
        screenSharing,
        toggleScreenShare,
        chatOnly,

    } = useLivekitStore();
    const navigate = useNavigate()

    const { myHandRaised, handAnimations, raisedParticipants, toggleHandUp } = useLivekitStore();
    const [showParticipants, setShowParticipants] = useState(false);
    const toggleParticipants = () => setShowParticipants((prev) => !prev);

    const handleLeave = () =>{
        leaveRoom();
        navigate("/chat");
    }


    return (
        <footer className="p-4 bg-base-100 shadow">
            <div className="flex flex-wrap justify-center gap-2 flex-1">
                <div className="flex flex-1 justify-center space-x-2">
                    {/* 마이크 토글 */}
                    <button
                        className={`btn btn-outline ${micEnabled ? "btn-success" : ""}`}
                        disabled={chatOnly}
                        onClick={() => toggleMic()}
                    >
                        🎤 {micEnabled ? "끄기" : "켜기"}
                    </button>

                    {/* 카메라 토글 */}
                    <button
                        className={`btn btn-outline ${cameraEnabled ? "btn-success" : ""}`}
                        disabled={chatOnly}
                        onClick={() => toggleCamera()}
                    >
                        📷 {cameraEnabled ? "끄기" : "켜기"}
                    </button>

                    {/* 화면 공유 */}
                    <button
                        className={`btn btn-outline ${screenSharing ? "btn-success" : ""}`}
                        onClick={() =>
                            toggleScreenShare()
                        }
                    >
                        🖥️ {screenSharing ? "중지" : "공유"}
                    </button>

                    {/* 손들기 */}
                    <button className="btn btn-warning" onClick={toggleHandUp}>
                        {myHandRaised ? "✋ 손 내리기" : "✋ 손들기"}
                    </button>
                    <AnimatePresence>
                        {handAnimations.map(anim => (
                            <motion.div
                                key={anim.id}
                                initial={{ opacity: 0, y: 40, scale: 0.5, rotate: anim.rotate }}
                                animate={{ opacity: 1, y: -380 + anim.y, scale: 6.0, rotate: 0, transition: { duration: 0.6 } }}
                                exit={{ opacity: 0, y: -100, scale: 0.8, transition: { duration: 0.3 } }}
                                className="absolute bottom-10 text-6xl select-none pointer-events-none"
                                style={{ left: `calc(50% + ${anim.x}%)` }}
                            >
                                {anim.emoji}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* 방 떠나기 */}
                    <button className="btn btn-error" onClick={handleLeave}>
                        🚪 떠나기
                    </button>
                </div>

                <div className="flex flex-wrap justify-end gap-2 mt-2 sm:mt-0">
                    <button className="btn btn-outline" onClick={toggleParticipants}>👥 참가자</button>
                    <button className="btn btn-outline" onClick={handleChatSidebar}>💬 채팅</button>
                </div>
                {/* 참가자 리스트 모달 */}
                {showParticipants && room && (
                    <div className="fixed top-20 right-5 w-60 bg-base-100 text-base-content shadow-lg rounded-lg p-4 z-50">
                        <h3 className="font-bold mb-2">
                            참가자 ({1 + room.remoteParticipants.size}) {/* 나 포함 */}
                        </h3>
                        <ul>
                            {/* 나 자신 */}
                            <li className="flex justify-between items-center mb-1">
                                <span>나</span>
                                {myHandRaised && <span>✋</span>}
                            </li>

                            {/* 다른 참가자 */}
                            {Array.from(room.remoteParticipants.values()).map((participant) => (
                                <li
                                    key={participant.identity}
                                    className="flex justify-between items-center mb-1"
                                >
                                    <span>{participant.identity}</span>
                                    {raisedParticipants[participant.identity] && <span>✋</span>}
                                </li>
                            ))}
                        </ul>

                        <button
                            className="mt-2 btn btn-sm btn-outline w-full"
                            onClick={() => setShowParticipants(false)}
                        >
                            닫기
                        </button>
                    </div>
                )}

            </div>
        </footer>
    );
}