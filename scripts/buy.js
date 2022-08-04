const { ethers } = require("hardhat");
const mineBlocks = require("../utils/mine-blocks");

const TOKEN_ID = 1;

const buy = async () => {
	const nftMarketplace = await ethers.getContract("NftMarketplace");
	const basicNft = await ethers.getContract("BasicNft");

	const accounts = await ethers.getSigners();
	const connectedNftMarketplace = await nftMarketplace.connect(accounts[1]);

	const item = await connectedNftMarketplace.getListing(
		basicNft.address,
		TOKEN_ID
	);

	console.log("Buying NFT...");

	const txn = await connectedNftMarketplace.buyItem(
		basicNft.address,
		TOKEN_ID,
		{
			value: item.price.toString(),
		}
	);
	await txn.wait(1);

	console.log("NFT Bought");

	await mineBlocks(3, 1000);

	console.log("Mined 3 Blocks");
};

buy()
	.then(() => process.exit(0))
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});
