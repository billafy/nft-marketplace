const { network, ethers } = require("hardhat");

const { readFileSync, writeFileSync } = require("fs");

const FRONTEND_STATIC_FOLDER = "./frontend/static";

const updateContractAddresses = async () => {
	const fileName = `${FRONTEND_STATIC_FOLDER}/contractAddresses.json`;
	const nftMarketplace = await ethers.getContract("NftMarketplace");
	let addresses = {};
	try {
		const data = readFileSync(fileName, "utf8");
		addresses = JSON.parse(data);
		addresses[network.config.chainId] = nftMarketplace.address;
		writeFileSync(fileName, JSON.stringify(addresses), { flag: "w" });
	} catch {}
};

const updateAbi = async () => {
	const fileName = `${FRONTEND_STATIC_FOLDER}/contractAbi.json`;
	const nftMarketplace = await ethers.getContract("NftMarketplace");
	try {
		writeFileSync(
			fileName,
			nftMarketplace.interface.format(ethers.utils.FormatTypes.json),
			{ flag: "w" }
		);
	} catch {}
};

module.exports = async () => {
	await updateContractAddresses();
	await updateAbi();
};
