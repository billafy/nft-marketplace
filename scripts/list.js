const { ethers } = require("hardhat");
const mineBlocks = require("../utils/mine-blocks");

let txn, txnReceipt;

const list = async () => {
	const nftMarketplace = await ethers.getContract("NftMarketplace");
	const basicNft = await ethers.getContract("BasicNft");

	console.log("Minting NFT...");

	txn = await basicNft.mintNft();
	txnReceipt = await txn.wait(1);

	const tokenId = txnReceipt.events[0].args.tokenId;

	console.log(`NFT Minted with Token ID ${tokenId}`);

	console.log("Getting NFT Approval...");

	txn = await basicNft.approve(nftMarketplace.address, tokenId);
	await txn.wait(1);

	console.log("Approved");

	console.log("Listing NFT...");

	txn = await nftMarketplace.listItem(
		basicNft.address,
		tokenId,
		ethers.utils.parseEther("1")
	);
	await txn.wait(1);

	console.log("NFT Listed");

	await mineBlocks(3, 1000);

	console.log('Mined 3 Blocks');
};

list()
	.then(() => process.exit(0))
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});
