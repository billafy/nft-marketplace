import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import contractAddresses from "../constants/contractAddresses.json";
import { useNotification } from "web3uikit";
import nftMarketplaceAbi from "../constants/nftMarketplaceAbi.json";
import { ethers } from "ethers";

const Withdraw = () => {
	const { rawChainId } = useMoralis();
	const chainId = rawChainId ? parseInt(rawChainId).toString() : "31337";
	const marketplaceAddress = contractAddresses["NftMarketplace"][chainId];
	const dispatch = useNotification();
	const [amountEarned, setAmountEarned] = useState("0");
	const { runContractFunction: getAmountEarned } = useWeb3Contract({
		abi: nftMarketplaceAbi,
		contractAddress: marketplaceAddress,
		functionName: "getAmountEarned",
		params: {}
	});
	const { runContractFunction: withdraw } = useWeb3Contract({
		abi: nftMarketplaceAbi,
		contractAddress: marketplaceAddress,
		functionName: "withdraw",
		params: {}
	});

	const handleWithdrawSuccess = async (txn) => {
		await txn.wait(1);
		dispatch({ type: "success", message: "Withdrawn", position: "topR" });
	};

	const _getAmountEarned = async () => {
		try {
			setAmountEarned((await getAmountEarned()).toString());
		} catch {
		}
	};

	useEffect(() => {
		_getAmountEarned();
	}, []);

	return (
		<div>
			<h3>Withdraw Earned Amount</h3>
			<p>
				{ethers.utils.formatUnits(
					amountEarned ? amountEarned.toString() : "0",
					"ether"
				)}{" "}
				ETH
			</p>
			<input
				type="button"
				value="Withdraw"
				onClick={() => {
					withdraw({
						onError: (err) => {
							console.log(err);
						},
						onSuccess: handleWithdrawSuccess,
					});
				}}
			/>
		</div>
	);
};

export default Withdraw;
