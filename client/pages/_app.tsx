import axios from 'axios';
import { SWRConfig } from 'swr';
import 'tailwindcss/tailwind.css';
import Header from '../components/Header';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<title>Ticketing</title>
			</Head>
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
