import { Button, Modal, Row, Checkbox, Text, Input } from "@nextui-org/react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [modal, setModal] = useState(false);
  function signIn(){}
  return (
    <>
      <Head>
        <title>Meet Em</title>
        <meta name="description" content="The app where you can meet them" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <Text size={42}>
          Meet Em
        </Text>
        <ul
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "30%",
          }}
        >
          <li>
            <Button bordered flat rounded onClick={signIn}>
              Sign In
            </Button>
          </li>
          {/* <li>
            <Button bordered flat rounded>
              Sign out
            </Button>
          </li> */}
          {/* <li>
            <Button bordered flat rounded>
              Create Room
            </Button>
          </li> */}
          <li>
            <Button bordered flat rounded onClick={() => setModal(true)}>
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
                  <Text size={22}>
                    Meet Em
                  </Text>
                </Text>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Meet Em is a web app where you can meet fellow developers and
                  share your knowledge. If you wanna get in touch this is my{" "}
                  <Link target={'_blank'} href={"https://ananth243.xyz"}>website</Link>, you can
                  contact me here.
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button auto flat color="error" onClick={() => setModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </li>
        </ul>
      </div>
    </>
  );
}
