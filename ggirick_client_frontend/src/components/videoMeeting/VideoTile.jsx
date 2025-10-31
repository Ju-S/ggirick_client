import {useEffect, useRef, useState} from "react";

export default function VideoTile({ track, name, local }) {
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
        <div className="card bg-base-200 shadow rounded-lg overflow-hidden relative">
            <div className="absolute top-2 left-2 badge badge-secondary">{name}</div>
            <video
                ref={videoRef}
                autoPlay
                muted={local}
                className="w-full h-full object-cover"
            />
            {/* 전체화면 버튼 */}
            <button
                onClick={toggleFullScreen}
                className="absolute bottom-2 right-2 bg-base-100 bg-opacity-50 text-base-content p-1 rounded hover:bg-opacity-70"
            >
                전체화면
            </button>
        </div>
    );
}
