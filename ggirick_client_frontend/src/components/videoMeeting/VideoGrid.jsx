import { useState } from "react";
import useEmployeeStore from "@/store/hr/employeeStore.js";
import { useLivekitStore } from "@/store/chat/useLivekitStore.js";
import VideoTile from "@/components/videoMeeting/VideoTile.jsx";
import { PersonStanding, Maximize2, Minimize2, Grid2x2, Grid3x3 } from "lucide-react";
import { TbGrid4X4 } from "react-icons/tb";

export default function VideoGrid({ localVideoTrack, localAudioTrack }) {
    const [layoutCols, setLayoutCols] = useState(2);
    const [presentingIndex, setPresentingIndex] = useState(null);

    const { selectedEmployee } = useEmployeeStore();
    const remoteParticipants = useLivekitStore((state) => state.remoteParticipants);

    // 참가자 구성
    const participants = [
        {
            name: selectedEmployee.name,
            local: true,
            videoTrack: localVideoTrack,
            audioTrack: localAudioTrack,
        },
        ...remoteParticipants.map((p) => ({
            name: p.identity,
            local: false,
            videoTrack: p.videoTrack,
            audioTrack: p.audioTrack,
        })),
    ];

    // 🔹 Grid Class 계산
    let gridClass = "";
    if (presentingIndex !== null) gridClass = "grid-cols-1";
    else if (layoutCols === 1) gridClass = "grid-cols-1";
    else if (layoutCols === 2) gridClass = "grid-cols-2";
    else if (layoutCols === 3) gridClass = "grid-cols-3";
    else gridClass = "grid-cols-4";

    // 🔹 레이아웃 변경 함수
    const cycleLayout = () => {
        setLayoutCols((prev) => (prev >= 4 ? 1 : prev + 1));
    };

    // 🔹 발표자 모드 토글
    const togglePresenting = (idx) => {
        setPresentingIndex(presentingIndex === idx ? null : idx);
    };

    // 🔹 표시할 트랙 (발표 모드일 때는 해당 하나만)
    const visibleParticipants =
        presentingIndex !== null ? [participants[presentingIndex]] : participants;

    return (
        <div className="relative flex-1 p-4 overflow-y-auto">
            {/* 🔸 상단 버튼 */}
            <div className="absolute top-2 right-2 flex space-x-2 z-10">
                {/* 레이아웃 전환 */}
                <button
                    onClick={cycleLayout}
                    className="btn btn-sm btn-outline btn-secondary"
                    title="레이아웃 변경"
                >
                    {layoutCols === 1 ? (
                        <PersonStanding size={18} />
                    ) : layoutCols === 2 ? (
                        <Grid2x2 size={18} />
                    ) : layoutCols === 3 ? (
                        <Grid3x3 size={18} />
                    ) : (
                        <TbGrid4X4 size={18} className="opacity-70" />
                    )}
                </button>

                {/* 발표자 모드 전환 */}
                {presentingIndex === null ? (
                    <button
                        onClick={() => setPresentingIndex(0)}
                        className="btn btn-sm btn-outline btn-accent"
                        title="발표자 모드"
                    >
                        <Maximize2 size={18} />
                    </button>
                ) : (
                    <button
                        onClick={() => setPresentingIndex(null)}
                        className="btn btn-sm btn-outline btn-accent"
                        title="모두 보기"
                    >
                        <Minimize2 size={18} />
                    </button>
                )}
            </div>

            {/* 🔸 비디오 그리드 */}
            <div className={`grid ${gridClass} gap-4`}>
                {visibleParticipants.map((p, idx) => (
                    <div
                        key={p.name}
                        className={`relative cursor-pointer transition-transform duration-300 ${
                            presentingIndex === idx ? "h-full" : ""
                        }`}
                        onClick={() => togglePresenting(idx)}
                    >
                        <VideoTile
                            track={p.videoTrack}
                            name={p.name}
                            local={p.local}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
