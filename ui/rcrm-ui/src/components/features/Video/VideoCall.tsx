import React, { useState, useRef, useEffect, useMemo } from "react";
import * as signalR from "@microsoft/signalr";

import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  Mic,
  MicOff,
  Videocam,
  VideocamOff,
  CallEnd,
  Group,
  Padding,
} from "@mui/icons-material";
import EnvUtilities from "@/utilities/EnvUtilities";
import CircleIcon from "@mui/icons-material/Circle";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import Grid from "@mui/material/Grid2";
import AppConstants from "@/constants/constants";
import { useAppDispatch, useAppSelector } from "@/hooks/StoreHooks";
import {
  openRightDrawer,
  closeRightDrawer,
  setRightDrawerContent,
} from "@/store/Slices/commonSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import NavUtilities from "@/utilities/NavUtilities";
import AppLoader from "@/components/ui-components/AppLoader";
import StringUtilities from "@/utilities/StringUtilities";
import SocketUtilities from "@/utilities/SocketUtilities";
import { CallerInfoDto } from "@/models/Users/UserLookupModel";
import { useSelector } from "react-redux";
import AppPage from "@/components/ui-components/AppPage";

import audioFile from "@/assets/Microsoft Teams Incoming Call Sound (Slowed) - Mobiles24.mp3";

const constraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  video: {
    width: { min: 1280, ideal: 1920, max: 1920 }, // Prefer 1080p
    height: { min: 720, ideal: 1080, max: 1080 }, // Minimum HD (720p)
    frameRate: { ideal: 30, max: 60 }, // Smoother video
    aspectRatio: { ideal: 16 / 9 }, // Keep widescreen format
    facingMode: "user", // "user" for front camera, "environment" for back
  },
};

const createTextVideoStream2 = async (name: string): Promise<MediaStream> => {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas rendering context not supported");

  // Create a temporary div for rendering content
  const tempDiv = document.createElement("div");
  tempDiv.style.width = "640px";
  tempDiv.style.height = "480px";
  tempDiv.style.display = "flex";
  tempDiv.style.flexDirection = "column";
  tempDiv.style.alignItems = "center";
  tempDiv.style.justifyContent = "center";
  tempDiv.style.backgroundColor = "black";
  tempDiv.style.color = "white";
  tempDiv.style.fontFamily = "Ubuntu, sans-serif";
  tempDiv.style.position = "absolute";
  tempDiv.style.top = "50";
  tempDiv.style.left = "50";
  tempDiv.style.right = "0";
  tempDiv.style.bottom = "50";
  tempDiv.style.margin = "50";

  // Ensure text is centered properly
  tempDiv.innerHTML = `
    <div 
      style="
        width: 80px; 
        height: 80px; 
        background-color: #FF5722; 
        color: white; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        border-radius: 50%;
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 15px;
      "
    >
      ${name.charAt(0).toUpperCase()}
    </div>
    <h2 style="margin: 0; color: white; font-size: 28px;">${name}</h2>
  `;

  document.body.appendChild(tempDiv);

  // Convert the div to a canvas
  const tempCanvas = await html2canvas(tempDiv, { backgroundColor: null });
  ctx.drawImage(tempCanvas, 0, 0);

  // Remove the temporary div
  document.body.removeChild(tempDiv);

  // Capture the canvas as a MediaStream
  return canvas.captureStream(30);
};

const createTextVideoStream = (): MediaStream => {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas rendering context not supported");

  // Function to draw the "No Video" text
  const drawFrame = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("No Video", canvas.width / 2, canvas.height / 2);
  };

  // Draw the first frame
  drawFrame();

  // Start capturing the canvas as a MediaStream
  const stream = canvas.captureStream(30); // 30 FPS

  // Update the frame every second to simulate a video feed
  setInterval(drawFrame, 1000);

  return stream;
};

const VideoCall: React.FC = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [connections, setConnections] = useState<CallerInfoDto[]>([]);
  const [participantsDrawer, setParticipantsDrawer] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const loggedInUser = useSelector((state: any) => state.auth);
  const audioElement = useRef<HTMLAudioElement>(new Audio(audioFile));

  const currentUserFullName = useMemo(() => {
    return `${loggedInUser.firstName} ${loggedInUser.lastName}`;
  }, [loggedInUser]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const meetName = useMemo(
    () => searchParams.get("name") ?? "",
    [searchParams]
  );

  const newConnection = useRef(
    SocketUtilities.getConnection(
      `${EnvUtilities.GetApiRootURL("hubs/meeting/pro")}`
    )
  );

  const peerConnection = useRef(
    new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    })
  );

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const call = async (callerId: string) => {
    if (!peerConnection.current || !localStream) return;

    const offer = await peerConnection.current.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    });

    await peerConnection.current.setLocalDescription(offer);

    try {
      await newConnection.current?.send(
        "sendOffer",
        newConnection.current.connectionId,
        callerId,
        JSON.stringify(offer)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const playRingtone = () => {
    audioElement.current.play().catch((e) => console.log("audio", e));
  };

  const pauseRingtone = () => {
    audioElement.current.pause();
    audioElement.current.currentTime = 0;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleReceiveOffer = async (offerString: string, callerId: string) => {
    playRingtone();
    const offer = JSON.parse(offerString);
    dispatch(
      setRightDrawerContent(
        <Stack gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              pauseRingtone();
              dispatch(closeRightDrawer());
              if (!peerConnection.current) {
                toast.error("Peer connection unavailable.");
                return;
              }

              await peerConnection.current.setRemoteDescription(
                new RTCSessionDescription(offer)
              );
              const answer = await peerConnection.current.createAnswer();
              await peerConnection.current.setLocalDescription(answer);

              await newConnection.current?.send(
                "sendAnswer",
                callerId,
                JSON.stringify(answer)
              );

              setIsCallStarted(true);
            }}
          >
            Answer
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              pauseRingtone();
              dispatch(closeRightDrawer());
            }}
          >
            Decline
          </Button>
        </Stack>
      )
    );
    dispatch(openRightDrawer());
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleReceiveAnswer = async (
    remoteGuy: string,
    answerString: string
  ) => {
    const answer = JSON.parse(answerString);

    if (peerConnection.current) {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleReceiveIceCandidate = async (candidateString: string) => {
    const candidate = JSON.parse(candidateString);
    const newCandidate = new RTCIceCandidate(candidate);

    if (peerConnection.current) {
      try {
        await peerConnection.current.addIceCandidate(newCandidate);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onIceCandidate = async (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      const candidate = event.candidate.toJSON();
      try {
        await newConnection.current?.send(
          "sendIceCandidate",
          JSON.stringify(candidate)
        );
      } catch {}
    }
  };

  const gotRemoteStream = async (event: RTCTrackEvent) => {
    if (remoteVideoRef.current) {
      if (event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      } else {
        remoteVideoRef.current.srcObject = await createTextVideoStream2(
          loggedInUser.firstName + loggedInUser.lastName
        );
      }
    }
  };

  useEffect(() => {
    if (newConnection.current) {
      newConnection.current.on("receiveOffer", handleReceiveOffer);
      newConnection.current.on("receiveAnswer", handleReceiveAnswer);
      newConnection.current.on(
        "receiveIceCandidate",
        handleReceiveIceCandidate
      );
      newConnection.current.on("UpdateConnections", setConnections);
    }
  }, [handleReceiveAnswer, handleReceiveIceCandidate, handleReceiveOffer]);

  useEffect(() => {
    if (peerConnection.current) {
      peerConnection.current.addEventListener("icecandidate", onIceCandidate);
      peerConnection.current.addEventListener("track", gotRemoteStream);
    }
  }, [onIceCandidate]);

  useEffect(() => {
    if (newConnection.current) {
      newConnection.current
        .start()
        .then(() => {
          navigator.mediaDevices
            .getUserMedia(constraints)
            .then(async (stream) => {
              setLocalStream(stream);
              if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
              }

              if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject =
                  await createTextVideoStream2(currentUserFullName);
              }

              stream
                .getTracks()
                .forEach((track) =>
                  peerConnection.current.addTrack(track, stream)
                );
            });
        })
        .catch((reason) => console.error(reason));
    }
  }, []);

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioEnabled(audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoEnabled(videoTrack.enabled);
    }
  };

  const hangup = () => {
    peerConnection.current?.close();
    localStream?.getTracks().forEach((track) => track.stop());

    toast.error("Call ended.");

    setTimeout(() => {
      navigate(NavUtilities.ToSecureArea("meetings"));
    }, 2000);
  };

  return (
    <AppPage
      title={meetName}
      content={
        <>
          <Drawer
            variant="temporary"
            anchor="right"
            open={participantsDrawer}
            onClose={() => setParticipantsDrawer(false)}
          >
            <Box
              sx={{
                width: "350px",
                padding: AppConstants.layout.StandardPadding,
                marginTop: "3.5rem",
              }}
            >
              <Typography variant="overline" gutterBottom>
                Active Users ({connections.length})
              </Typography>
              <Divider />
              {connections.length > 0 ? (
                <List dense>
                  {connections
                    .filter(
                      (x) =>
                        x.connectionId !== newConnection.current.connectionId
                    )
                    .map((s, index) => (
                      <React.Fragment key={s.connectionId}>
                        <Stack
                          direction={"row"}
                          alignItems={"center"}
                          justifyContent={"space-between"}
                        >
                          <Stack
                            direction={"row"}
                            gap={AppConstants.layout.StandardSpacing}
                            alignItems={"center"}
                          >
                            <CircleIcon fontSize="small" color="success" />
                            <Typography variant="subtitle2">
                              {/* {StringUtilities.addEllipsis(s.fullName, 200)} */}
                              {s.fullName}
                            </Typography>
                          </Stack>
                          <IconButton onClick={() => call(s.connectionId)}>
                            <CallOutlinedIcon />
                          </IconButton>
                        </Stack>
                        {index !== connections.length - 1 && (
                          <Divider component="li" />
                        )}
                      </React.Fragment>
                    ))}
                </List>
              ) : (
                <Typography>No active users</Typography>
              )}
            </Box>
          </Drawer>
          <Grid
            container
            sx={{
              height: "70vh",
              backgroundColor: "#f4f5f7",
              overflow: "hidden",
            }}
          >
            <Grid size={{ md: 9, xs: 12 }} sx={{ height: "100%" }}>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                // muted
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
              />
            </Grid>
            <Grid
              size={{ md: 3 }}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ffffff",
                borderLeft: "1px solid #e0e0e0",
              }}
            >
              <Typography variant="subtitle2">
                {`${currentUserFullName}(You)`}
              </Typography>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                // muted
                style={{
                  height: "30%",
                  width: "80%",
                  borderRadius: "8px",
                  objectFit: "cover",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
                <Tooltip title={isAudioEnabled ? "Mute" : "Unmute"}>
                  <IconButton
                    color={isAudioEnabled ? "primary" : "error"}
                    onClick={toggleAudio}
                  >
                    {isAudioEnabled ? <Mic /> : <MicOff />}
                  </IconButton>
                </Tooltip>
                <Tooltip title={isVideoEnabled ? "Stop Video" : "Start Video"}>
                  <IconButton
                    color={isVideoEnabled ? "primary" : "error"}
                    onClick={toggleVideo}
                  >
                    {isVideoEnabled ? <Videocam /> : <VideocamOff />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="End Call">
                  <IconButton color="error" onClick={hangup}>
                    <CallEnd fontSize="large" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="View Participants">
                  <IconButton
                    color="primary"
                    onClick={() => setParticipantsDrawer(true)}
                  >
                    <Group />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
          </Grid>
        </>
      }
    ></AppPage>
  );
};

export default VideoCall;
