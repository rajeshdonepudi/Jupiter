import React, { useState, useRef, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EnvUtilities from "@/utilities/EnvUtilities";
import AppConstants from "@/constants/constants";
import { useAppDispatch, useAppSelector } from "@/hooks/StoreHooks";
import { openRightDrawer, closeRightDrawer } from "@/store/Slices/commonSlice";
import Grid from '@mui/material/Grid2';


const Test: React.FC = () => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");
  const [reloadTimer, setReloadTimer] = useState<number>(0);
  const [connections, setConnections] = useState<string[]>([]);
  const [callerId, setCallerId] = useState<string>("");
  const [logs, addLog] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const commonState = useAppSelector((state) => state.common);
  const newConnection = useRef(
    new signalR.HubConnectionBuilder()
      .withUrl(`${EnvUtilities.GetApiRootURL("hubs/meeting/pro")}`)
      .withAutomaticReconnect()
      .build()
  );

  const peerConnection = useRef(
    new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }, // Google STUN server
      ],
    })
  );

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Handle received offer
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleReceiveOffer = async (offerString: string, callerId: string) => {
    const offer = JSON.parse(offerString);

    dispatch(openRightDrawer());

    console.log("ss", commonState.isRightDrawerOpen);

    addMessageToLog(`Offer received from Peer: ${callerId} `);

    if (!peerConnection.current) {
      toast.error("Peer connection unavailable.");
    }

    if (peerConnection.current) {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      newConnection.current
        ?.send("sendAnswer", callerId, JSON.stringify(answer))
        .then(() => {
          addMessageToLog(
            `Sending answer to (${callerId}) for the received offer.`
          );
        });
    }
  };

  // Handle received answer
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleReceiveAnswer = async (
    remoteGuy: string,
    answerString: string
  ) => {
    const answer = JSON.parse(answerString);
    addMessageToLog(`Received answer from Peer (${remoteGuy})`);

    if (peerConnection.current) {
      await peerConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    }
  };

  // Handle received ICE candidates
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleReceiveIceCandidate = async (candidateString: string) => {
    const candidate = JSON.parse(candidateString);
    const newCandidate = new RTCIceCandidate(candidate);

    if (peerConnection.current) {
      peerConnection.current
        .addIceCandidate(newCandidate)
        .then(() => {
          addMessageToLog("Adding ICE Candidate to peer connection");
        })
        .catch((reason) => {
          console.error(reason);
          addMessageToLog("Failed :: Adding ICE Candidate to peer connection");
        });
    }
  };

  useEffect(() => {
    if (newConnection) {
      newConnection.current.on("receiveOffer", handleReceiveOffer);
      newConnection.current.on("receiveAnswer", handleReceiveAnswer);
      newConnection.current.on(
        "receiveIceCandidate",
        handleReceiveIceCandidate
      );
      newConnection.current.on("UpdateConnections", (updatedConnections) => {
        setConnections(updatedConnections);
      });
    }
  }, [
    newConnection,
    handleReceiveAnswer,
    handleReceiveIceCandidate,
    handleReceiveOffer,
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onIceCandidate = async (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      const candidate = event.candidate.toJSON();
      addMessageToLog("Got ice candidates");
      newConnection.current
        ?.send("sendIceCandidate", JSON.stringify(candidate))
        .then(() => {
          addMessageToLog(`Sending ICE Candidates to ${callerId}`);
        })
        .catch(() => {
          addMessageToLog(`Failed:: sending ICE Candidates to ${callerId}`);
        });
    }
  };

  useEffect(() => {
    if (peerConnection) {
      peerConnection.current.addEventListener("icecandidate", onIceCandidate);
      peerConnection.current.addEventListener("track", gotRemoteStream);
    }
  }, [onIceCandidate, peerConnection]);

  const start = async () => {
    newConnection.current
      ?.start()
      .then(() => {
        addMessageToLog("Connection started...");

        navigator.mediaDevices
          .getUserMedia({
            audio: true,
            video: true,
          })
          .then((stream) => {
            setLocalStream(stream);
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }
            return stream;
          })
          .then((stream) => {
            stream
              .getTracks()
              .forEach((track) =>
                peerConnection.current.addTrack(track, stream)
              );
          });
      })
      .catch((reason: string) => {
        addMessageToLog("Failed to start connection...");
      });
  };

  const addMessageToLog = (message: string) => {
    addLog((prev) => [...prev, message]);
  };

  const call = async () => {
    if (!peerConnection.current || !localStream) {
      addMessageToLog("No peer connection or local stream available.");
      return;
    }

    addMessageToLog("Call initiated...");

    peerConnection.current
      .createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })
      .then((offer) => {
        peerConnection.current.setLocalDescription(offer);
        newConnection.current
          ?.send(
            "sendOffer",
            newConnection.current.connectionId,
            callerId,
            JSON.stringify(offer)
          )
          .then(() => {
            addLog((prev) => [...prev, "Offer sent successfully!"]);
          })
          .catch((error) => {
            addLog((prev) => [...prev, "Failed send offer."]);
          });
      });
  };

  const hangup = () => {
    peerConnection.current?.close();
    toast.error("Call ended.");
    setInterval(() => {
      setReloadTimer((prev) => prev + 1);
    }, 1000);
    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  const gotRemoteStream = (event: RTCTrackEvent) => {
    if (
      remoteVideoRef.current &&
      remoteVideoRef.current.srcObject !== event.streams[0]
    ) {
      remoteVideoRef.current.srcObject = event.streams[0];
    }
  };

  useEffect(() => {
    if (newConnection.current.state === signalR.HubConnectionState.Connected) {
      newConnection.current
        .invoke("GetAllConnections")
        .then((connectionsList) => {
          setConnections(connectionsList);
        });
    }
  }, [newConnection.current.state]);

  return (
    <Grid container spacing={AppConstants.layout.StandardSpacing}>
      <Grid size={12}>
        RMeet
        {peerConnection.current?.connectionState}
      </Grid>
      <Grid size={12}>
        <Paper variant="outlined">
          <Grid container>
            <Grid size={3}>
              <Typography>Call Time: {elapsedTime}</Typography>
            </Grid>
            <Grid size={3}>
              <Typography>
                Connection State: {newConnection.current.state}
              </Typography>
            </Grid>
            <Grid size={3}>
              <Typography>
                My Connection ID:
                {connections.find(
                  (x) => x === newConnection.current.connectionId
                )}
              </Typography>
            </Grid>
            <Grid size={3}>
              {reloadTimer > 0 && (
                <Typography variant="h5">
                  Redirecting in {reloadTimer} Seconds
                </Typography>
              )}
            </Grid>
            <Grid size={3}>
              Caller ID: {callerId}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid size={12}>
        <Stack margin={"1rem"} gap={2} direction={"row"}>
          <Button variant="outlined" onClick={start}>
            Start
          </Button>
          <Button variant="outlined" onClick={call}>
            Call
          </Button>
          <Button variant="outlined" onClick={hangup}>
            Hangup
          </Button>
        </Stack>
      </Grid>
      <Grid size={12}>
        <Grid container spacing={AppConstants.layout.StandardSpacing}>
          <Grid size={8}>
            <Grid container>
              <Grid size={6}>
                <video
                  width={"100%"}
                  height={"100%"}
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                />
              </Grid>
              <Grid size={6}>
                <video
                  width={"100%"}
                  height={"100%"}
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid size={4}>
            <Grid size={12}>
              <Stack direction={"row"}>
                <TextField
                  value={callerId}
                  onChange={(e) => setCallerId(e.target.value)}
                  placeholder="Connection ID"
                  fullWidth
                />
                <Button onClick={call} variant="contained">
                  Call
                </Button>
              </Stack>
            </Grid>
            <Paper
              style={{ padding: "1rem", height: "100%" }}
              variant="outlined"
            >
              <Typography variant="caption">Other Connected Clients</Typography>
              <Divider />
              <List dense={true}>
                {connections.length > 0 ? (
                  connections
                    .filter((x) => x !== newConnection.current.connectionId)
                    .map((s) => (
                      <ListItem key={s}>
                        <ListItemText primary={s} />
                      </ListItem>
                    ))
                ) : (
                  <Box height={"100%"}>
                    <Typography variant="body2">
                      No clients connected.
                    </Typography>
                  </Box>
                )}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <Grid size={12}>
        {Array.from(new Set(logs)).map((x, index) => (
          <>
            <Typography variant="caption">{x}</Typography>
            {index !== logs.length - 1 && <Divider />}
          </>
        ))}
      </Grid>
    </Grid>
  );
};

export default Test;
