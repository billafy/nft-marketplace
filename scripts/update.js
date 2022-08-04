const { ethers } = require("hardhat");
const mineBlocks = require("../utils/mine-blocks");

const TOKEN_ID = 2;

const update = async () => {
	const nftMarketplace = await ethers.getContract("NftMarketplace");
	const basicNft = await ethers.getContract("BasicNft");

	console.log("Updating NFT...");

	const txn = await nftMarketplace.updateItem(
		basicNft.address,
		TOKEN_ID,
		ethers.utils.parseEther("3")
	);
	await txn.wait(1);

	console.log("NFT Updated");

	await mineBlocks(3, 1000);

	console.log("Mined 3 Blocks");
};

update()
	.then(() => process.exit(0))
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});
