require("dotenv").config();
const Moralis = require("moralis/node");
const contractAddresses = require("./static/contractAddresses.json");

const appId = process.env.NEXT_PUBLIC_APP_ID;
const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
const masterKey = process.env.masterKey;
const chainId = process.env.chainId;

const moralisChainId = chainId === "31337" ? "1337" : chainId;

const contractAddress = contractAddresses[chainId];


const main = async () => {
	await Moralis.start({ serverUrl, appId, masterKey });

	const options = { chainId: moralisChainId, sync_historical: true, address: contractAddress };

	const itemListedOptions = {
		...options,
		topic: "ItemListed(address, address, uint256, uint256)",
		abi: {
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "seller",
					type: "address",
				},
				{
					indexed: true,
					internalType: "address",
					name: "nftAddress",
					type: "address",
				},
				{
					indexed: true,
					internalType: "uint256",
					name: "tokenId",
					type: "uint256",
				},
				{
					indexed: false,
					internalType: "uint256",
					name: "price",
					type: "uint256",
				},
			],
			name: "ItemListed",
			type: "event",
		},
		tableName: "ItemListed",
	};

	const itemBoughtOptions = {
		...options,
		topic: "ItemBought(address, address, uint256, uint256)",
		abi: {
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "buyer",
					type: "address",
				},
				{
					indexed: true,
					internalType: "address",
					name: "nftAddress",
					type: "address",
				},
				{
					indexed: true,
					internalType: "uint256",
					name: "tokenId",
					type: "uint256",
				},
				{
					indexed: false,
					internalType: "uint256",
					name: "price",
					type: "uint256",
				},
			],
			name: "ItemBought",
			type: "event",
		},
		tableName: "ItemBought",
	};

	const itemRemovedOptions = {
		...options,
		topic: "ItemRemoved(address, address, uint256)",
		abi: {
			anonymous: false,
			inputs: [
				{
					indexed: true,
					internalType: "address",
					name: "seller",
					type: "address",
				},
				{
					indexed: true,
					internalType: "address",
					name: "nftAddress",
					type: "address",
				},
				{
					indexed: true,
					internalType: "uint256",
					name: "tokenId",
					type: "uint256",
				},
			],
			name: "ItemRemoved",
			type: "event",
		},
		tableName: "ItemRemoved",
	};

	console.log(await Moralis.Cloud.run('watchContractEvent', itemListedOptions, {useMasterKey: true}));
	await Moralis.Cloud.run('watchContractEvent', itemBoughtOptions, {useMasterKey: true});
	await Moralis.Cloud.run('watchContractEvent', itemRemovedOptions, {useMasterKey: true});
};

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
