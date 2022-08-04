const { ethers } = require("hardhat");
const mineBlocks = require("../utils/mine-blocks");

let txn, txnReceipt;

const mint = async () => {
	const basicNft = await ethers.getContract("BasicNft");

	console.log("Minting NFT...");

	txn = await basicNft.mintNft();
	txnReceipt = await txn.wait(1);

	const tokenId = txnReceipt.events[0].args.tokenId;

	console.log(`NFT Minted with Token ID ${tokenId}`);

	await mineBlocks(3, 1000);

	console.log('Mined 3 Blocks');
};

mint()
	.then(() => process.exit(0))
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});
