import { Button, Container } from "@nextui-org/react";
import {
  DocumentData,
  QuerySnapshot,
  query,
  collection,
  doc,
  getDocs,
  where,
  deleteDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { db, app } from "../config/firebase";
import { getAuth, User } from "firebase/auth";
import Link from "next/link";
import Delete from "../utilities/icons/Delete";
import { PressEvent } from "@react-types/shared";

export default function Home() {
  const [docs, setDocs] = useState<QuerySnapshot<DocumentData>>();
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);
  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });
  async function deleteRoom(e: PressEvent, docx: DocumentData) {
    const res = await deleteDoc(doc(db, "meet-ids", docx.id));
    const q = query(collection(db, "meet-ids"), where("uid", "==", user.uid));
    getDocs(q).then((docs) => {
      setDocs(docs);
    });
  }
  useEffect(() => {
    if (user) {
      const q = query(collection(db, "meet-ids"), where("uid", "==", user.uid));
      getDocs(q).then((docs) => {
        setDocs(docs);
      });
    } else {
      setDocs(undefined);
    }
  }, [user]);
  return (
    <>
      <Navbar />
      {!user && (
        <Container xl css={{ textAlign: "center" }}>
          Welcome to meet em You can meet fellow developers here Just login to
          google and type in your room name and it&apos;s as simple as that
        </Container>
      )}
      {user &&
        docs &&
        docs.docs.map((doc) => (
          <li key={doc.id} style={{ display: "flex" }}>
            <Link
              href={`/${doc.data().id[0]}-${doc.data().id[1]}-${
                doc.data().id[2]
              }`}
              style={{ marginLeft: "3rem" }}
            >
              {`${doc.data().id[0]}-${doc.data().id[1]}-${doc.data().id[2]}`}
            </Link>
            <Button
              onPress={(e) => deleteRoom(e, doc)}
              auto
              color={"error"}
              iconRight={<Delete />}
            />
          </li>
        ))}
    </>
  );
}
