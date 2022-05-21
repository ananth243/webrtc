import { Container } from "@nextui-org/react";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Container xl css={{ textAlign: "center" }}>
        Welcome to meet em You can meet fellow developers here Just login to
        google and type in your room name and it&apos;s as simple as that
      </Container>
    </>
  );
}
