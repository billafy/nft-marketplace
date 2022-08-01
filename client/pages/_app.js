import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import Header from "../components/Header";
// import Head from "next/head";

const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const MyApp = ({ Component, pageProps }) => {
	return (
		<MoralisProvider
			appId={APP_ID}
			serverUrl={SERVER_URL}
		>
			
			<Header />
			<Component {...pageProps} />
		</MoralisProvider>
	);
};

export default MyApp;