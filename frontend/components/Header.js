import {ConnectButton} from 'web3uikit';
import Link from 'next/link';
import styles from '../styles/Header.module.scss';

const Header = () => {
	return (
		<header className={styles.header}>
			<div className={styles.logo}>
				NFT Marketplace
			</div>
			<nav className={styles.nav}>
				<Link href='/'>Home</Link> 
				<Link href='/sell-nfts'>Sell NFTs</Link> 
			</nav>
			<div className={styles.connectButton}>
				<ConnectButton/>
			</div>
		</header>
	);
};

export default Header;
