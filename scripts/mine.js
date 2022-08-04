const mineBlocks = require("../utils/mine-blocks");

const mine = async () => {
	await mineBlocks(3, 1000);

	console.log('Mined 3 Blocks');
};

mine()
	.then(() => process.exit(0))
	.catch((error) => {
		console.log(error);
		process.exit(1);
	});
