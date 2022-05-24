import { User } from "firebase/auth";
import { MutableRefObject, useEffect } from "react";
import AgoraRTM from "../utilities/agora/agora-rtm-sdk-1.4.4";

let localStream: MediaStream,
  remoteStream: MediaStream,
  peerConnection: RTCPeerConnection;
let { NEXT_PUBLIC_AGORA_APP_ID } = process.env;
let client, channel;

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"],
    },
  ],
};

interface Message {
  type: "offer" | "candidate" | "answer";
  offer?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidate;
  answer?: RTCSessionDescriptionInit;
}

export class RTC {
  video1: HTMLVideoElement;
  video2: HTMLVideoElement;
  uid: string;
  roomId: string;
  AgoraRTC: any;
  constructor(
    video1: HTMLVideoElement,
    video2: HTMLVideoElement,
    uid: string,
    roomId: string
  ) {
    this.video1 = video1;
    this.video2 = video2;
    this.uid = uid;
    this.roomId = roomId;
  }
  async handleMessage(msg, memberId: string) {
    const { type, offer, answer, candidate }: Message = JSON.parse(msg.text);
    if (type === "offer") {
      await this.createAnswer(memberId, offer);
    }
    if (type === "answer") {
      this.addAnswer(answer);
    }
    if (type === "candidate") {
      await peerConnection.addIceCandidate(candidate);
    }
  }

  handleUser(memberId: string) {
    this.createOffer(memberId);
  }

  async init() {
    client = await AgoraRTM.createInstance(NEXT_PUBLIC_AGORA_APP_ID);
    await client.login({ uid: this.uid.slice(0,5) });
    channel = client.createChannel(this.roomId);
    await channel.join();

    channel.on("MemberJoined", this.handleUser);

    channel.on("MessageFromPeer", this.handleMessage);

    localStream = await navigator.mediaDevices.getUserMedia({ video: true });
    this.video1.srcObject = localStream;
  }

  async createPeerConnection(memberId: string) {
    peerConnection = new RTCPeerConnection(servers);
    remoteStream = new MediaStream();
    this.video2.srcObject = remoteStream;

    if (!localStream) {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.video1.srcObject = localStream;
    }
    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });
    peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };
    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        await client.sendMessageToPeer({
          text: JSON.stringify({
            type: "candidate",
            candidate: event.candidate,
          }),
        });
      }
    };
  }

  async createAnswer(memberId: string, offer: RTCSessionDescriptionInit) {
    await this.createPeerConnection(memberId);
    await peerConnection.setRemoteDescription(offer);
    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    client.sendMessageToPeer(
      { type: JSON.stringify({ type: "answer", answer }) },
      memberId
    );
  }

  async createOffer(memberId: string) {
    await this.createPeerConnection(memberId);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    client.sendMessageToPeer(
      { text: JSON.stringify({ type: "offer", offer }) },
      memberId
    );
  }

  async addAnswer(answer: RTCSessionDescriptionInit) {
    if (!peerConnection.currentRemoteDescription) {
      await peerConnection.setRemoteDescription(answer);
    }
  }
}

interface props {
  videoRef1: MutableRefObject<HTMLVideoElement>;
  videoRef2: MutableRefObject<HTMLVideoElement>;
  user: User;
  meetId: string[];
}

export default function VideoCaller({
  videoRef1,
  videoRef2,
  user,
  meetId,
}: props) {
  useEffect(() => {
    async function initialize() {
      const rtc = new RTC(
        videoRef1.current,
        videoRef2.current,
        user.uid,
        `${meetId[0]}-${meetId[1]} + ${meetId[2]}`
      );
      await rtc.init();
    }
    initialize();
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2em",
        background: "white",
      }}
    >
      <video autoPlay playsInline ref={videoRef1} style={{ width: "100%" }} />
      <video
        ref={videoRef2}
        autoPlay
        playsInline
        style={{ width: "100%", height: "300px" }}
      />
    </div>
  );
}
