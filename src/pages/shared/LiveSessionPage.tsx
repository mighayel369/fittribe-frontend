import React from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { useVideoSession } from "../../hooks/useVideoSession";
import { VideoFeed } from "../../components/VideoFeed";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react"

export const LiveVideoSession: React.FC = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const { user } = useAppSelector((state) => state.auth);
    const currentBookingId = bookingId || "";

    const {
        localStream,
        remoteStream,
        isMuted,
        isVideoOff,
        toggleMute,
        toggleVideo
    } = useVideoSession(currentBookingId, user?.id);


    return (
        <div className="h-screen w-screen bg-slate-950 flex flex-col justify-between p-6">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-800">
                    {remoteStream ? (
                        <VideoFeed stream={remoteStream} />
                    ) : (
                        <p className="text-slate-400 font-bold animate-pulse text-sm">
                            WAITING FOR CONNECTING PEER...
                        </p>
                    )}
                </div>
                <div className="relative rounded-2xl bg-slate-900 overflow-hidden border border-slate-800">
                    <VideoFeed stream={localStream} isMuted={true} />
                </div>
            </div>


            <div className="mt-6 flex justify-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <button onClick={toggleMute} className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 text-white">
                    {isMuted ? <MicOff /> : <Mic />}
                </button>
                <button onClick={toggleVideo} className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 text-white">
                    {isVideoOff ? <VideoOff /> : <Video />}
                </button>
                <button onClick={() => window.history.back()} className="p-3 bg-red-600 rounded-full hover:bg-red-700 text-white">
                    <PhoneOff />
                </button>
            </div>
        </div>
    )
}