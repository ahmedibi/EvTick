import React, { useState, useRef, useEffect } from "react";
import {
  LivestreamPlayer,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
} from "lucide-react";
import LiveChat from "./LiveChat";

const apiKey = "n4bxhj5ucfb7";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJAc3RyZWFtLWlvL2Rhc2hib2FyZCIsImlhdCI6MTc2NjI2MDk3NywiZXhwIjoxNzY2MzQ3Mzc3LCJ1c2VyX2lkIjoiIWFub24iLCJyb2xlIjoidmlld2VyIiwiY2FsbF9jaWRzIjpbImxpdmVzdHJlYW06bGl2ZXN0cmVhbV8xMDE0ODBjZi1lZWJmLTQ3M2UtYWJhZS03MjQ5N2MyM2EyNWQiXX0.cMXkYC8lcUDCDUnoo3_wZa3IBumnSi_wpaBHQ8do-x4";

const user = { type: "anonymous" };

// 👉 make it static like you requested
const callId = "livestream_101480cf-eebf-473e-abae-72497c23a25d";

const client = new StreamVideoClient({ apiKey, user, token });

export default function StreamPage() {
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle Fullscreen change events to update internal state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    const videoEl = containerRef.current?.querySelector("video");
    if (videoEl) {
      if (playing) videoEl.pause();
      else videoEl.play();
      setPlaying(!playing);
    }
  };

  const toggleMute = () => {
    const videoEl = containerRef.current?.querySelector("video");
    if (videoEl) {
      const newMute = !muted;
      videoEl.muted = newMute;
      setMuted(newMute);
      if (newMute) setVolume(0);
      else setVolume(1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current) {
        containerRef.current.requestFullscreen();
      }
    } else {
      document.exitFullscreen();
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    const videoEl = containerRef.current?.querySelector("video");
    if (videoEl) videoEl.volume = val;
    setVolume(val);
    setMuted(val === 0);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div
      style={{
        height: "100vh",
        paddingTop: "120px", // Adjust for fixed navbar (approx 100-120px)
        display: "flex",
        flexDirection: "row", // Desktop default: row
        background: "#0f0f0f",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
      className="stream-page-container"
    >
      {/* 
        Container for Video
        In fullscreen, this will take over.
        Normally, it takes remaining width next to chat.
      */}
      <div
        ref={containerRef}
        onMouseMove={() => setControlsVisible(true)}
        style={{
          flex: 1,
          position: "relative",
          backgroundColor: "#000",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
        onMouseLeave={() => playing && setControlsVisible(false)}
      >
        {/* LIVE + Timer Overlay */}
        <div
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 20,
            pointerEvents: "none", // Click through
          }}
        >
          <div
            style={{
              backgroundColor: "#e74c3c",
              color: "#fff",
              fontWeight: "bold",
              padding: "6px 12px",
              borderRadius: "4px",
              fontSize: "0.85rem",
              boxShadow: "0 2px 10px rgba(231, 76, 60, 0.4)",
            }}
          >
            LIVE
          </div>
          <div
            style={{
              color: "#eee",
              padding: "4px 10px",
              borderRadius: "4px",
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
              fontSize: "0.9rem",
              fontFamily: "monospace",
            }}
          >
            {formatTime(elapsed)}
          </div>
        </div>

        {/* Video Player */}
        <StreamVideo client={client}>
          <LivestreamPlayer
            ref={playerRef}
            callType="livestream"
            callId={callId}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </StreamVideo>

        {/* Custom Controls Bar */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "100%",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 60%, transparent 100%)",
            padding: "20px 24px 24px",
            opacity: controlsVisible ? 1 : 0,
            transition: "opacity 0.3s ease-in-out",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            zIndex: 30,
          }}
        >
          {/* Play/Pause */}
          <button onClick={togglePlay} style={iconBtn}>
            {playing ? (
              <Pause fill="#fff" size={24} />
            ) : (
              <Play fill="#fff" size={24} />
            )}
          </button>

          {/* Volume Group */}
          <div
            style={{ display: "flex", alignItems: "center", gap: "12px" }}
            className="volume-group"
          >
            <button onClick={toggleMute} style={iconBtn}>
              {muted || volume === 0 ? (
                <VolumeX size={24} />
              ) : (
                <Volume2 size={24} />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              style={{
                width: "100px",
                accentColor: "#3498db",
                cursor: "pointer",
                height: "4px",
              }}
            />
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }}></div>

          {/* Right side controls */}
          <button onClick={toggleFullscreen} style={iconBtn} title="Fullscreen">
            {fullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
          </button>
        </div>
      </div>

      {/* 
        Chat Container 
        Hidden in fullscreen mode (unless we overlay it, but typically hidden in standard OS fullscreen)
        Responsive: Collapses on very small screens if we added media queries, 
        but for now we stick to a fixed width on desktop 
      */}
      {!fullscreen && (
        <div
          style={{
            width: "350px",
            minWidth: "300px",
            borderLeft: "1px solid #333",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <LiveChat />
        </div>
      )}

      {/* Mobile/Resonsive tweak: 
          If you want it to stack on mobile, we'd need a media query hook or CSS module. 
          Given the user requested "full size", a flex row is good for desktop. 
      */}
    </div>
  );
}

const iconBtn = {
  background: "transparent",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  padding: "8px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "background 0.2s",
  ":hover": {
    background: "rgba(255,255,255,0.1)",
  },
};

