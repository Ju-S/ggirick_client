import {useEffect, useRef, useState} from "react";

export default function VideoTile({ track, name, local,hasAudio }) {
    const videoRef = useRef();

    const [isFullScreen, setIsFullScreen] = useState(false);

    // 전체화면 토글
    const toggleFullScreen = () => {

            if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
            else if (videoRef.current.webkitRequestFullscreen) videoRef.current.webkitRequestFullscreen();
            else if (videoRef.current.msRequestFullscreen) videoRef.current.msRequestFullscreen();

        setIsFullScreen(!isFullScreen);
    };


    useEffect(() => {
        if (track && videoRef.current) {
            track.attach(videoRef.current);
            return () => track.detach(videoRef.current);
        }
    }, [track]);

    return (
        <div className="card bg-primary shadow rounded-lg overflow-hidden relative">

            {track ? (
               <>
                   <div className="absolute top-2 left-2 badge badge-secondary">{name}</div>
                   <video
                       ref={(el) => el && (el.srcObject = new MediaStream([track.mediaStreamTrack]))}
                       autoPlay
                       muted={local}
                       className="w-full h-full object-cover"
                   />
                   <button
                       onClick={toggleFullScreen}
                       className="absolute bottom-2 right-2 bg-base-100 bg-opacity-50 text-base-content p-1 rounded hover:bg-opacity-70"
                   >
                       전체화면
                   </button>
               </>
            ) : (
                // 비디오 없을 때 프로필 표시
                <div className="flex flex-col items-center justify-center text-primary-content">
                    <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-2xl font-bold">
                        {name.slice(0, 1).toUpperCase()} {/* 이름 첫 글자 */}
                    </div>
                    <span className="mt-2 text-sm">{name}</span>

                </div>
            )}
        </div>
    );
}
