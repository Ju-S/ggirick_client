import { useState } from "react";
import VideoTile from "@/components/videoMeeting/VideoTile.jsx";
import {Grid, Grid2x2, Grid3x3, Maximize2, Minimize2, PersonStanding} from "lucide-react";
import {TbGrid4X4} from "react-icons/tb"; // 아이콘 사용 (lucide-react 설치 필요)

export default function VideoGrid({ localVideoTrack, remoteTracks }) {
    const [layoutCols, setLayoutCols] = useState(2); // 기본 2열
    const [presentingIndex, setPresentingIndex] = useState(null);

    // 🔹 전체 트랙 목록 구성
    const tracks = [];
    if (localVideoTrack) tracks.push({ track: localVideoTrack, name: "Me", local: true });
    remoteTracks.forEach(({ trackPublication, participantIdentity }) => {
        const track = trackPublication.videoTrack ?? trackPublication.track;
        if (track && track.kind === "video") {
            tracks.push({ track, name: participantIdentity, local: false });
        }
    });

    //  Grid Class 계산
    let gridClass = "";
    if (presentingIndex !== null) gridClass = "grid-cols-1";
    else if (layoutCols === 1) gridClass = "grid-cols-1";
    else if (layoutCols === 2) gridClass = "grid-cols-2";
    else if (layoutCols === 3) gridClass = "grid-cols-3";
    else gridClass = "grid-cols-4";

    // 레이아웃 변경 함수
    const cycleLayout = () => {
        setLayoutCols((prev) => (prev >= 4 ? 1 : prev + 1));
    };

    //  발표자 모드 토글
    const togglePresenting = (idx) => {
        setPresentingIndex(presentingIndex === idx ? null : idx);
    };

    // 표시할 트랙 (발표 모드일 때는 해당 하나만)
    const visibleTracks =
        presentingIndex !== null ? [tracks[presentingIndex]] : tracks;

    return (
        <div className="relative flex-1 p-4 overflow-y-auto">
            {/*레이아웃 버튼 */}
            <div className="absolute top-2 right-2 flex space-x-2 z-10">
                <button
                    onClick={cycleLayout}
                    className="btn btn-sm btn-outline btn-secondary"
                    title="레이아웃 변경"
                >
                    {layoutCols === 1 ? <PersonStanding /> :
                        layoutCols === 2 ? <Grid2x2 /> :
                            layoutCols === 3 ? <Grid3x3 /> :
                                <TbGrid4X4 className="opacity-70" />}
                </button>

                {presentingIndex === null ? (
                    <button
                        onClick={() => setPresentingIndex(0)}
                        className="btn btn-sm btn-outline btn-accent"
                        title="발표자 모드"
                    >
                        <Maximize2 />
                    </button>
                ) : (
                    <button
                        onClick={() => setPresentingIndex(null)}
                        className="btn btn-sm btn-outline btn-accent"
                        title="모두 보기"
                    >
                        <Minimize2 />
                    </button>
                )}
            </div>

            {/* 그리드 */}
            <div className={`flex-1 grid ${gridClass} gap-4 overflow-y-auto`}>
                {visibleTracks.map((t, idx) => (
                    <div
                        key={idx}
                        className={`relative cursor-pointer transition-transform duration-300 ${
                            presentingIndex === idx ? "h-full" : ""
                        }`}
                        onClick={() => togglePresenting(idx)}
                    >
                        <VideoTile track={t.track} name={t.name} local={t.local}  />
                    </div>
                ))}
            </div>
        </div>
    );
}
