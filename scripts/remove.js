const { ethers } = require("hardhat");
const mineBlocks = require("../utils/mine-blocks");

const TOKEN_ID = 3;

const remove = async () => {
	const nftMarketplace = await ethers.getContract("NftMarketplace");
	const basicNft = await ethers.getContract("BasicNft");

	console.log("Removing NFT...");

	const txn = await nftMarketplace.removeItem(
		basicNft.address,
		TOKEN_ID
	);
	await txn.wait(1);

	console.log("NFT Removed");

	await mineBlocks(3, 1000);

	console.log('Mined 3 Blocks');
};

remove()
	.then(() => process.exit(0))
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});
