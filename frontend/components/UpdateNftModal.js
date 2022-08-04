import { useState } from "react";
import { useWeb3Contract } from "react-moralis";
import { Modal, Input, useNotification } from "web3uikit";
import nftMarketplaceAbi from "../constants/nftMarketplaceAbi.json";
import { ethers } from "ethers";

const UpdateNftModal = ({
	onClose,
	marketplaceAddress,
	nftAddress,
	tokenId,
	isVisible,
}) => {
	const [newPrice, setNewPrice] = useState("");
	const { runContractFunction: updateItem } = useWeb3Contract({
		abi: nftMarketplaceAbi,
		contractAddress: marketplaceAddress,
		functionName: "updateItem",
		params: {
			nftAddress,
			tokenId,
			price: ethers.utils.parseEther(newPrice || "0"),
		},
	});
	const dispatch = useNotification();

	const handleUpdateItemSuccess = async (txn) => {
		await txn.wait(1);
		dispatch({ type: "success", message: "NFT Updated", position: "topR" });
		onClose && onClose();
		setNewPrice("");
	};

	return (
		<Modal
			isVisible={isVisible}
			onCancel={onClose}
			onCloseButtonPressed={onClose}
			onOk={() => {
				updateItem({
					onError: (err) => {
						console.log(err);
					},
					onSuccess: handleUpdateItemSuccess,
				});
			}}
		>
			<Input
				label="Update NFT Price (ETH)"
				name="price"
				type="number"
				onChange={({ target: { value } }) => setNewPrice(value)}
			/>
		</Modal>
	);
};

export default UpdateNftModal;
