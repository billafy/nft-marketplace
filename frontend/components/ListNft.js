import { useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import contractAddresses from "../constants/contractAddresses.json";
import { useNotification } from "web3uikit";
import nftMarketplaceAbi from "../constants/nftMarketplaceAbi.json";
import { ethers } from "ethers";
import basicNftAbi from "../constants/basicNftAbi.json";

const ListNft = () => {
	const { rawChainId } = useMoralis();
	const chainId = rawChainId ? parseInt(rawChainId).toString() : "31337";
	const marketplaceAddress = contractAddresses["NftMarketplace"][chainId];
	const dispatch = useNotification();
	const [nftAddress, setNftAddress] = useState("");
	const [tokenId, setTokenId] = useState("");
	const [price, setPrice] = useState("");
	const { runContractFunction: listItem } = useWeb3Contract({
		abi: nftMarketplaceAbi,
		contractAddress: marketplaceAddress,
		functionName: "listItem",
		params: {
			nftAddress,
			tokenId,
			price: ethers.utils.parseEther(price.toString() || "0"),
		},
	});
	const { runContractFunction: approve } = useWeb3Contract({
		abi: basicNftAbi,
		contractAddress: nftAddress,
		functionName: "approve",
		params: {
			to: marketplaceAddress,
			tokenId,
		},
	});

	const handleListItemSuccess = async (txn) => {
		await txn.wait(1);
		dispatch({ type: "success", message: "NFT Listed", position: "topR" });
	};

	const _listItem = async (txn) => {
		await txn.wait(1);
		listItem({
			onError: (err) => {
				console.log(err);
			},
			onSuccess: handleListItemSuccess,
		});
	};

	const _approve = async () => {
		if (nftAddress && tokenId && price) {
			approve({
				onError: (err) => {
					console.log(err);
				},
				onSuccess: _listItem,
			});
		}
	};

	return (
		<form>
			<div>
				<label>NFT Address</label>
				<input
					type="text"
					value={nftAddress}
					onChange={({ target: { value } }) => setNftAddress(value)}
				/>
			</div>
			<div>
				<label>Token ID</label>
				<input
					type="text"
					value={tokenId}
					onChange={({ target: { value } }) => setTokenId(value)}
				/>
			</div>
			<div>
				<label>Price (in ETH)</label>
				<input
					type="number"
					value={price}
					onChange={({ target: { value } }) => setPrice(value)}
				/>
			</div>
			<input type="button" onClick={_approve} value="List" />
		</form>
	);
};

export default ListNft;
