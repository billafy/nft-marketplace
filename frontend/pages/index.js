import { useMoralisQuery } from "react-moralis";
import styles from "../styles/Home.module.css";
import NftCard from "../components/NftCard";

const Home = () => {
	const { data: listedItems, isFetching: fetchingListedItems } =
		useMoralisQuery("ActiveItem", (query) =>
			query.limit(10).descending("tokenId")
		);

	return (
		<div className={styles.container}>
			<h3>Listed NFTs</h3>
			{fetchingListedItems ? (
				<p>Loading...</p>
			) : (
				<div>
					{listedItems.map((listedItem) => {
						const {
							price,
							nftAddress,
							marketplaceAddress,
							seller,
							tokenId,
						} = listedItem.attributes;
						return (
							<NftCard
								key={`${nftAddress}-${tokenId}`}
								{...{
									price,
									nftAddress,
									marketplaceAddress,
									seller,
									tokenId,
								}}
							/>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default Home;
