import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getDocs, query, collection, where } from "firebase/firestore";
import { app, db } from "../config/firebase";
import { getAuth } from "firebase/auth";

function Room() {
  const auth = getAuth(app);
  const [user, setUser] = useState(auth.currentUser);
  let meetId: string[];
  const router = useRouter();
  const { id } = router.query;
  if (Array.isArray(id)) meetId = id[0].split("-");
  else if(id) meetId = id.split("-");
  auth.onAuthStateChanged((user) => {
    if (user) setUser(user);
    else {
      setUser(null);
    }
  });
  useEffect(() => {
      if(user){
        const q = query(
          collection(db, "meet-ids"),
          where("uid", "==", user.uid),
          where("id", "==", meetId)
        );
        getDocs(q).then((res) => {
          if(res.docs.length!==0){
            console.log(res);
          } else{
            router.push('/404');
          }
        });
      }
  },[user, meetId, router]);
  return (
    <>
      <div>{meetId}</div>
    </>
  );
}

export default Room;
