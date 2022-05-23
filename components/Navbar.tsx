import { Button, Modal, Row, Checkbox, Text, Input } from "@nextui-org/react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { app, db } from "../config/firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import generateId from "../utilities/id";
import { useRouter } from "next/router";

export default function Navbar() {
  const [modal, setModal] = useState(false);
  const [state, setState] = useState(false);
  const router = useRouter();
  const auth = getAuth(app);
  auth.onAuthStateChanged((user) => {
    if (user) setState(true);
    else setState(false);
  });
  async function createRoom() {
    const id = generateId();
    // If id already exits call func again
    const q = query(collection(db, "meet-ids"), where("id", "==", id));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      createRoom();
    } else {
      await addDoc(collection(db, "meet-ids"), { id, uid: auth.currentUser.uid, users:[] });
      router.push(`/${id[0]}-${id[1]}-${id[2]}`);
    }
  }
  async function signIn() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
    }
  }
  function signout() {
    signOut(auth).catch((err) => console.log(err));
  }
  return (
    <>
      <Head>
        <title>Meet Em</title>
        <meta name="description" content="The app where you can meet them" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Text size={42}>Meet Em</Text>
        <ul
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "30%",
          }}
        >
          {!state && (
            <>
              <li>
                <Button bordered flat rounded onPress={signIn}>
                  Sign In
                </Button>
              </li>
              <li>
                <Button bordered flat rounded onPress={() => setModal(true)}>
                  Credits
                </Button>
                <Modal
                  closeButton
                  blur
                  aria-labelledby="modal-title"
                  open={modal}
                  onClose={() => setModal(false)}
                >
                  <Modal.Header>
                    <Text id="modal-title" size={32}>
                      <Text size={22}>Meet Em</Text>
                    </Text>
                  </Modal.Header>
                  <Modal.Body>
                    <p>
                      Meet Em is a web app where you can meet fellow developers
                      and share your knowledge. If you wanna get in touch this
                      is my{" "}
                      <Link target={"_blank"} href={"https://ananth243.xyz"}>
                        website
                      </Link>
                      , you can contact me here.
                    </p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      auto
                      flat
                      color="error"
                      onPress={() => setModal(false)}
                    >
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </li>
            </>
          )}
          {state && (
            <>
              <li>
                <Button bordered flat rounded onPress={signout}>
                  Sign out
                </Button>
              </li>
              <li>
                <Button bordered flat rounded onPress={createRoom}>
                  Create Room
                </Button>
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}
