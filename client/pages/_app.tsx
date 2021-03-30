import axios from "axios";
import { SWRConfig } from "swr";
import "tailwindcss/tailwind.css";
import Header from "../components/Header";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <SWRConfig
        value={{
          fetcher: (url: string) => axios.get(url).then((res) => res.data),
          revalidateOnFocus: false,
          errorRetryCount: 2,
        }}
      >
        <Header />
        <Component {...pageProps} />
      </SWRConfig>
    </>
  );
}

export default MyApp;
