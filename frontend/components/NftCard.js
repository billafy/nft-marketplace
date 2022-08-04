import { useEffect, useState } from "react";
import Link from "next/link";
import { useMoralis, useWeb3Contract } from "react-moralis";
import basicNftAbi from "../constants/basicNftAbi.json";
import nftMarketplaceAbi from "../constants/nftMarketplaceAbi.json";
import Image from "next/image";
import { Card } from "web3uikit";
import { ethers } from "ethers";
import UpdateNftModal from "./UpdateNftModal";
import { useNotification } from "web3uikit";

const NftCard = ({
	price,
	nftAddress,
	tokenId,
	marketplaceAddress,
	seller,
}) => {
	const { account } = useMoralis();
	const [nft, setNft] = useState("");
	const dispatch = useNotification();
	const { runContractFunction: getTokenURI } = useWeb3Contract({
		abi: basicNftAbi,
		contractAddress: nftAddress,
		functionName: "tokenURI",
		params: { tokenId },
	});
	const { runContractFunction: buyItem } = useWeb3Contract({
		abi: nftMarketplaceAbi,
		contractAddress: marketplaceAddress,
		functionName: "buyItem",
		msgValue: price,
		params: { nftAddress, tokenId },
	});
	const [showUpdateNftModal, setShowUpdateNftModal] = useState(false);

	const hideModal = () => {
		setShowUpdateNftModal(false);
	};

	const updateURI = async () => {
		const tokenURI = await getTokenURI();
		if (tokenURI) {
			const response = await fetch(tokenURI);
			const data = await response.json();
			setNft(data);
		}
	};

	const handleBuyItemSuccess = async (txn) => {
		await txn.wait(1);
		dispatch({ type: "success", message: "NFT Bought", position: "topR" });
	};

	const handleCardClick = async () => {
		if (seller === account) setShowUpdateNftModal(true);
		else {
			buyItem({
				onError: (err) => {
					console.log(err);
				},
				onSuccess: handleBuyItemSuccess,
			});
		}
	};

	useEffect(() => {
		updateURI();
	}, []);

	return (
		<Card
			title={nft.name}
			description={nft.description}
			onClick={handleCardClick}
		>
			<strong>#{tokenId}</strong>
			<p>Owned By {seller === account ? "You" : seller}</p>
			<img src={nft.image} />
			<p>{ethers.utils.formatUnits(price, "ether")} ETH</p>
			<UpdateNftModal
				onClose={hideModal}
				isVisible={showUpdateNftModal}
				{...{ marketplaceAddress, nftAddress, tokenId }}
			/>
		</Card>
	);
};

export default NftCard;
