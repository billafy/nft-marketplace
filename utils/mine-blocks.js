const { network } = require("hardhat");

const sleep = async (sleepTime) => {
	return new Promise((resolve) => {
		setTimeout(resolve, sleepTime);
	});
};

const mineBlocks = async (numberOfBlocks, sleepTime) => {
	for (let i = 0; i < numberOfBlocks; ++i) {
		await network.provider.request({ method: "evm_mine", params: [] });
		if (sleepTime) await sleep(sleepTime);
	}
};

module.exports = mineBlocks;
