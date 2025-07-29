import React, { useEffect, useRef, useState } from "react";
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { authToken, createMeeting } from "../lib/api.js";
import { useAuthStore } from "../store/useAuthStore.js";

function JoinScreen({ getMeetingAndToken }) {
  const [meetingId, setMeetingId] = useState("");

  const onClick = async (isJoining) => {
    await getMeetingAndToken(isJoining ? meetingId : null);
  };

  return (
    <div className="flex flex-col bg-base-200 px-4">
      <div>
        <div className="card-body gap-4">
          <h2 className="card-title text-center">Join a Meeting</h2>
          <input
            type="text"
            placeholder="Enter On-Going Meeting ID"
            value={meetingId}
            onChange={(e) => setMeetingId(e.target.value)}
            className="input input-bordered w-full"
          />
          <div className="flex gap-2 justify-end">
            <button
              className="btn btn-primary"
              onClick={() => onClick(true)}
              disabled={!meetingId.trim()}
            >
              Join
            </button>
            <button
              className="btn btn-success"
              onClick={() => onClick(false)}
              disabled={!!meetingId.trim()}
            >
              Create Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParticipantView({
  participantId,
  isFocused,
  onFocus,
  isThumbnail = false,
}) {
  const micRef = useRef(null);
  const videoRef = useRef(null);

  const { webcamStream, micStream, webcamOn, micOn, isLocal, displayName } =
    useParticipant(participantId);

  useEffect(() => {
    if (videoRef.current) {
      if (webcamOn && webcamStream?.track) {
        const mediaStream = new window.MediaStream();
        mediaStream.addTrack(webcamStream.track);
        videoRef.current.srcObject = mediaStream;
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [webcamOn, webcamStream]);

  useEffect(() => {
    if (micRef.current) {
      if (micOn && micStream?.track) {
        const mediaStream = new window.MediaStream();
        mediaStream.addTrack(micStream.track);
        micRef.current.srcObject = mediaStream;
        micRef.current.play().catch(() => {});
      } else {
        micRef.current.srcObject = null;
      }
    }
  }, [micOn, micStream]);

  let cardClass =
    "card shadow bg-base-100 transition-all duration-300 mx-auto ";
  if (isThumbnail) {
    cardClass += "w-32 max-w-xs opacity-95 ring-0 scale-95";
  } else if (isFocused) {
    cardClass += "w-full max-w-3xl z-10 scale-105 ring-4 ring-primary";
  } else {
    cardClass += "w-full max-w-xs";
  }

  let videoHeight = isThumbnail
    ? "h-20"
    : isFocused
    ? "h-96 md:h-[480px]"
    : "h-40";

  return (
    <div className={cardClass}>
      <div className="card-body p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-xs md:text-sm truncate">
            {displayName}{" "}
            {isLocal && (
              <span className="badge badge-primary badge-xs ml-1">You</span>
            )}
          </span>
          {!isThumbnail && (
            <button
              className={
                "btn btn-xs " +
                (isFocused ? "btn-outline btn-primary" : "btn-ghost")
              }
              onClick={() => onFocus(isFocused ? null : participantId)}
              aria-label={isFocused ? "Minimize view" : "Enlarge view"}
            >
              {isFocused ? "Minimize" : "Enlarge"}
            </button>
          )}
        </div>
        <figure>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={isLocal}
            className={`rounded-lg w-full aspect-video bg-base-200 object-cover ${videoHeight}`}
          />
        </figure>
        <audio ref={micRef} autoPlay playsInline muted={isLocal} />
        <div className="flex items-center text-xs mt-2 gap-2">
          <span>
            {webcamOn ? (
              <span className="text-success">🎥 On</span>
            ) : (
              <span className="text-error">🎥 Off</span>
            )}
          </span>
          <span>
            {micOn ? (
              <span className="text-success">🎤 On</span>
            ) : (
              <span className="text-error">🎤 Off</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

function Controls() {
  const { leave, toggleMic, toggleWebcam } = useMeeting();

  return (
    <div className="flex flex-wrap gap-2 justify-center my-4">
      <button className="btn btn-error" onClick={leave}>
        Leave
      </button>
      <button className="btn btn-warning" onClick={toggleMic}>
        Toggle Mic
      </button>
      <button className="btn btn-info" onClick={toggleWebcam}>
        Toggle Camera
      </button>
    </div>
  );
}

function MeetingView({ meetingId, onMeetingLeave }) {
  const [joined, setJoined] = useState(null);
  const [focusedParticipant, setFocusedParticipant] = useState(null);

  const { join, participants } = useMeeting({
    onMeetingJoined: () => setJoined("JOINED"),
    onMeetingLeft: onMeetingLeave,
  });

  const joinMeeting = () => {
    setJoined("JOINING");
    join();
  };

  useEffect(() => {
    if (focusedParticipant && !participants.has(focusedParticipant)) {
      setFocusedParticipant(null);
    }
  }, [participants, focusedParticipant]);

  const participantIds = [...participants.keys()];

  const sideParticipantIds = participantIds.filter(
    (pid) => pid !== focusedParticipant
  );

  return (
    <div className="p-4 min-h-screen bg-base-200 flex flex-col items-center">
      <div className="w-full max-w-7xl mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-lg font-bold mb-1 text-base-content">
            Meeting ID: <span className="kbd kbd-sm">{meetingId}</span>
          </h2>
        </div>
      </div>

      {joined === "JOINED" ? (
        <>
          <Controls />

          {focusedParticipant ? (
            <div className="flex flex-col w-full max-w-5xl items-center justify-center mx-auto">
              {/* Focused participant in center */}
              <ParticipantView
                key={focusedParticipant}
                participantId={focusedParticipant}
                isFocused={true}
                onFocus={setFocusedParticipant}
                isThumbnail={false}
              />

              {!!sideParticipantIds.length && (
                <div className="mt-6 w-full flex overflow-x-auto gap-2 justify-center items-center">
                  {sideParticipantIds.map((participantId) => (
                    <ParticipantView
                      key={participantId}
                      participantId={participantId}
                      isFocused={false}
                      onFocus={setFocusedParticipant}
                      isThumbnail={true}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-4 w-full max-w-7xl mt-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {participantIds.map((participantId) => (
                <ParticipantView
                  key={participantId}
                  participantId={participantId}
                  isFocused={false}
                  onFocus={setFocusedParticipant}
                  isThumbnail={false}
                />
              ))}
            </div>
          )}
        </>
      ) : joined === "JOINING" ? (
        <div className="flex flex-col items-center gap-4 mt-10">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-primary">Joining the meeting...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-8 gap-3">
          <button className="btn btn-primary btn-lg" onClick={joinMeeting}>
            Join Meeting
          </button>
        </div>
      )}
    </div>
  );
}

function VideoCallComponent() {
  const authUser = useAuthStore();
  const [meetingId, setMeetingId] = useState(null);
  const [isConfirmingJoin, setIsConfirmingJoin] = useState(false); // New

  const getMeetingAndToken = async (id) => {
    if (id == null) {
      // User clicked create meeting button
      const newMeetingId = await createMeeting({ token: authToken });
      setMeetingId(newMeetingId);
    } else {
      // User entered a meeting ID and intends to join
      setMeetingId(id);
    }
    setIsConfirmingJoin(true); // Show confirmation/join screen
  };

  const onCancel = () => {
    setIsConfirmingJoin(false);
    setMeetingId(null); // Reset meeting ID to go back to JoinScreen
  };

  const onJoinConfirmed = () => {
    setIsConfirmingJoin(false);
    // MeetingProvider and MeetingView will render since meetingId remains set
  };

  // When no meetingId, show JoinScreen
  if (!meetingId) {
    return <JoinScreen getMeetingAndToken={getMeetingAndToken} />;
  }

  // Meeting already joined (MeetingProvider renders)
  return (
    <MeetingProvider
      config={{
        meetingId,
        micEnabled: true,
        webcamEnabled: true,
        name: authUser.fullName,
      }}
      token={authToken}
    >
      <MeetingView
        meetingId={meetingId}
        onMeetingLeave={() => {
          setMeetingId(null);
          setIsConfirmingJoin(false);
        }}
      />
    </MeetingProvider>
  );
}

export default VideoCallComponent;
