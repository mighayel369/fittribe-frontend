import { useEffect, useRef, useState } from "react";
import { getSocket } from "../utils/socket";

const RTC_CONFIG = {
    iceServers: [
        { urls: "stun:stun1.l.google.com:19002" },
        { urls: "stun:stun2.l.google.com:19002" },
    ],
};

export const useVideoSession = (bookingId: string, currentUserId: string | undefined) => {
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [permissionError, setPermissionError] = useState<string | null>(null);

    const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    const isProcessingOfferRef = useRef(false);

    useEffect(() => {
        if (!currentUserId || !bookingId) return;

        const socket = getSocket(currentUserId);

        const startStreamAndConnection = async () => {
            try {
                setPermissionError(null);

                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                localStreamRef.current = stream;

                const pc = new RTCPeerConnection(RTC_CONFIG);
                peerConnectionRef.current = pc;

                stream.getTracks().forEach((track) => pc.addTrack(track, stream));

                pc.ontrack = (event) => {
                    if (event.streams && event.streams[0]) {
                        setRemoteStream(event.streams[0]);
                    }
                };

                pc.onicecandidate = (event) => {
                    if (event.candidate) {
                        socket.emit("video_ice_candidate", { bookingId, candidate: event.candidate });
                    }
                };

                socket.off("peer_joined_video");
                socket.off("video_offer_received");
                socket.off("video_answer_received");
                socket.off("video_ice_candidate_received");
                socket.off("peer_left_video");

                socket.emit("join_video_session", { bookingId });

                socket.on("peer_joined_video", async () => {
                    if (!peerConnectionRef.current) return;
                    try {
                        const offer = await peerConnectionRef.current.createOffer();
                        await peerConnectionRef.current.setLocalDescription(offer);
                        socket.emit("video_offer", { bookingId, sdp: offer });
                    } catch (err) {
                        console.error("Error creating video offer:", err);
                    }
                });

                socket.on("video_offer_received", async ({ sdp }) => {
                    const pc = peerConnectionRef.current;
                    if (!pc) return;

                    if (pc.signalingState !== "stable" || isProcessingOfferRef.current) {
                        console.warn(`⚠️ Ignored duplicate/mid-flight offer. State: ${pc.signalingState}, Locked: ${isProcessingOfferRef.current}`);
                        return;
                    }

                    try {

                        isProcessingOfferRef.current = true;
                        console.log("🎬 Processing remote offer...");

                        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                        const answer = await pc.createAnswer();


                        await pc.setLocalDescription(answer);

                        socket.emit("video_answer", { bookingId, sdp: answer });
                    } catch (err) {
                        console.error("❌ Error during video offer processing:", err);
                    } finally {

                        isProcessingOfferRef.current = false;
                    }
                });

                socket.on("video_answer_received", async ({ sdp }) => {
                    const pc = peerConnectionRef.current;
                    if (!pc) return;

                    try {
                        if (pc.signalingState !== "have-local-offer") {
                            console.warn(`⚠️ Ignored unexpected answer. Current state: ${pc.signalingState}`);
                            return;
                        }
                        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
                    } catch (err) {
                        console.error("Error handling video answer:", err);
                    }
                });

                socket.on("video_ice_candidate_received", async ({ candidate }) => {
                    const pc = peerConnectionRef.current;
                    if (!pc) return;

                    try {
                        if (!pc.remoteDescription) {
                            console.warn("⏳ Received ICE candidate before remote description was set. Skipping.");
                            return;
                        }
                        await pc.addIceCandidate(new RTCIceCandidate(candidate));
                    } catch (err) {
                        console.error("❌ Error adding remote ICE candidate:", err);
                    }
                });

                socket.on("peer_left_video", () => {
                    setRemoteStream(null);
                });
            } catch (error: any) {
                if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
                    console.error("❌ User denied camera/mic permissions.");
                    setPermissionError("Camera and Microphone access is blocked. Please click the lock icon in your browser URL bar to allow permissions.");
                } else if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
                    console.error("❌ No webcam or mic hardware found.");
                    setPermissionError("No camera or microphone hardware was found on your device.");
                } else {
                    console.error("Media initialization error:", error);
                    setPermissionError("Could not access your camera or audio hardware.");
                }
            }
        };

        startStreamAndConnection();

        return () => {
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach((track) => track.stop());
            }
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close();
                peerConnectionRef.current = null;
            }
            isProcessingOfferRef.current = false;

            socket.emit("leave_video_session", { bookingId });
            socket.off("peer_joined_video");
            socket.off("video_offer_received");
            socket.off("video_answer_received");
            socket.off("video_ice_candidate_received");
            socket.off("peer_left_video");
        };
    }, [bookingId, currentUserId]);

    const toggleMute = () => {
        if (localStream) {
            const track = localStream.getAudioTracks()[0];
            if (track) {
                track.enabled = !track.enabled;
                setIsMuted(!track.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            const track = localStream.getVideoTracks()[0];
            if (track) {
                track.enabled = !track.enabled;
                setIsVideoOff(!track.enabled);
            }
        }
    };

    return { localStream, remoteStream, isMuted, isVideoOff, permissionError, toggleMute, toggleVideo };
};