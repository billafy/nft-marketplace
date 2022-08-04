import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import Header from "../components/Header";
// import Head from "next/head";

const APP_ID = process.env.NEXT_PUBLIC_APP_ID;
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

console.log(APP_ID, SERVER_URL);

const MyApp = ({ Component, pageProps }) => {
	return (
		<MoralisProvider serverUrl={SERVER_URL} appId={APP_ID}>
			<NotificationProvider>
				<Header />
				<Component {...pageProps} />
			</NotificationProvider>
		</MoralisProvider>
	);
};

export default MyApp;
