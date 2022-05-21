// import '../styles/globals.css'
import { AppProps } from "next/app";
import { createTheme, NextUIProvider } from "@nextui-org/react";
import Navbar from "../components/Navbar";

const darkTheme = createTheme({
  type: "dark",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider theme={darkTheme}>
        <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default MyApp;
