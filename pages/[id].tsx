import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { getDocs, query, collection, where } from "firebase/firestore";
import { app, db } from "../config/firebase";
import { getAuth } from "firebase/auth";

import dynamic from "next/dynamic";
const VideoCaller = dynamic(() => import("../components/webRTC"), {
  ssr: false,
});

function Room() {
  const auth = getAuth(app);
  const videoRef1 = useRef<HTMLVideoElement>();
  const videoRef2 = useRef<HTMLVideoElement>();
  const [user, setUser] = useState(auth.currentUser);
  const [RTC, setRTC] = useState(false);
  let meetId: string[];
  const router = useRouter();
  const { id } = router.query;
  if (Array.isArray(id)) meetId = id[0].split("-");
  else if (id) meetId = id.split("-");
  auth.onAuthStateChanged((user) => {
    if (user) setUser(user);
    else {
      setUser(null);
    }
  });
  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "meet-ids"),
        where("uid", "==", user.uid),
        where("id", "==", meetId)
      );
      getDocs(q).then(async (res) => {
        if (res.docs.length !== 0) {
          setRTC(true);
        } else {
          setRTC(false);
          router.push("/404");
        }
      });
    }
  }, [user, meetId, router]);
  return (
    RTC && (
      <VideoCaller
        videoRef1={videoRef1}
        videoRef2={videoRef2}
        user={user}
        meetId={meetId}
      />
    )
  );
}

export default Room;
