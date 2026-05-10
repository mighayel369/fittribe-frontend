import React, { useMemo, useCallback } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';

const VideoSession: React.FC = () => {
  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { user, role } = useAppSelector((state: any) => state.auth);

  const meetLink = searchParams.get('link');

  const roomName = useMemo(() => {
    const rawName = meetLink
      ? meetLink.split('/').pop()?.split('?')[0]
      : `FitTribe_${bookingId}`;

    return rawName?.replace(/[^a-zA-Z0-9]/g, '_') || "FitTribe_Default_Session";
  }, [meetLink, bookingId]);

  const isTrainer = role === 'trainer' || user?.role === 'trainer';


  const handleApiReady = useCallback((api: any) => {
    const apiAny = api as any;

    if (isTrainer) {
      apiAny.executeCommand('toggleLobby', true);

      const lobbyHandler = (_data: any) => {
        console.log("New participant requested to join the lobby");
      };

      if (typeof apiAny.on === 'function') {
        apiAny.on('lobbyPushAccepted', lobbyHandler);
      } else {
        apiAny.addEventListener('lobbyPushAccepted', lobbyHandler);
      }
    }

    apiAny.on('videoConferenceJoined', (_data: any) => {
      console.log("Local user joined the FitTribe session");
    });

    apiAny.on('videoConferenceLeft', () => {
      navigate(-1);
    });
  }, [isTrainer, navigate]);

  return (
    <div className="min-h-screen bg-black overflow-hidden">

      <div className="absolute top-4 left-6 z-50 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full backdrop-blur-md transition-all text-xs font-bold uppercase tracking-wider border border-white/5"
        >
          ← Leave Session
        </button>
        {isTrainer && (
          <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full backdrop-blur-md text-[10px] font-black uppercase border border-emerald-500/30">
            Moderator Mode Active
          </div>
        )}
      </div>

      <div className="h-screen w-full">
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={roomName}
          configOverwrite={{
            prejoinPageEnabled: false,
            enableLobby: true,
            startWithAudioMuted: true,
            enableWelcomePage: false,
            disableDeepLinking: true,
          }}
          userInfo={{
            displayName: user?.name || (isTrainer ? "Trainer" : "Client"),
            email: user?.email || "",
          }}
          interfaceConfigOverwrite={{
            TOOLBAR_BUTTONS: [
              'microphone', 'camera', 'desktop', 'fullscreen',
              'fodeviceselection', 'hangup', 'chat', 'settings',
              'raisehand', 'videoquality', 'tileview',
            ],
            SHOW_JITSI_WATERMARK: false,
          }}
          onApiReady={handleApiReady}
          onReadyToClose={() => navigate(-1)}
          getIFrameRef={(iframeRef) => {
            if (iframeRef) {
              iframeRef.style.height = '100%';
              iframeRef.style.width = '100%';
            }
          }}
        />
      </div>
    </div>
  );
};

export default VideoSession;