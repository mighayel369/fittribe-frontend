import React, { useEffect, useRef } from "react";
interface VideoFeedProps {
    stream: MediaStream | null;
    isMuted?: boolean
}

export const VideoFeed: React.FC<VideoFeedProps> = ({ stream, isMuted }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const videoElement = videoRef.current
        if (!videoElement) return

        if (stream) {
            videoElement.srcObject = stream
        } else {
            videoElement.srcObject = null;
        }

        return () => {
            if (videoElement) {
                videoElement.srcObject = null;
            }
        }
    },[stream])
    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isMuted}
            className="w-full h-full object-cover transform scale-x-100"
        />
    )
}