import {ConnectButton} from '@web3uikit/web3';
import Link from 'next/link';

const Header = () => {
	return (
		<header>
			<div>Logo</div>
			<nav>
				<Link href='/'>Home</Link> 
				<Link href='/sell-nfts'>Sell NFTs</Link> 
			</nav>
			<ConnectButton/>
		</header>
	);
};

export default Header;
