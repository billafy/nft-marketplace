const { network, ethers } = require("hardhat");

const { readFileSync, writeFileSync } = require("fs");

const FRONTEND_STATIC_FOLDER = "./frontend/constants";

const updateContractAddresses = async () => {
	const fileName = `${FRONTEND_STATIC_FOLDER}/contractAddresses.json`;
	const nftMarketplace = await ethers.getContract("NftMarketplace");
	const basicNft = await ethers.getContract("BasicNft");
	let addresses = {};
	try {
		const data = readFileSync(fileName, "utf8");
		addresses = JSON.parse(data) || {};
		addresses["NftMarketplace"] = {};
		addresses["BasicNft"] = {};
		addresses["NftMarketplace"][network.config.chainId] =
			nftMarketplace.address;
		addresses["BasicNft"][network.config.chainId] = basicNft.address;
		writeFileSync(fileName, JSON.stringify(addresses), { flag: "w" });
	} catch (err) {
		console.error(err);
	}
};

const updateAbi = async () => {
	const basicNftFileName = `${FRONTEND_STATIC_FOLDER}/basicNftAbi.json`;
	const nftMarketplaceFileName = `${FRONTEND_STATIC_FOLDER}/nftMarketplaceAbi.json`;
	const nftMarketplace = await ethers.getContract("NftMarketplace");
	const basicNft = await ethers.getContract("BasicNft");
	try {
		writeFileSync(
			basicNftFileName,
			basicNft.interface.format(ethers.utils.FormatTypes.json),
			{ flag: "w" }
		);
		writeFileSync(
			nftMarketplaceFileName,
			nftMarketplace.interface.format(ethers.utils.FormatTypes.json),
			{ flag: "w" }
		);
	} catch (err) {
		console.log(err);
	}
};

module.exports = async () => {
	await updateContractAddresses();
	await updateAbi();
};
