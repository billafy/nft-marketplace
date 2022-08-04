Moralis.Cloud.afterSave("ItemListed", async (req) => {
	const confirmed = req.object.get("confirmed");
	const logger = Moralis.Cloud.getLogger();
	if (confirmed) {
		const ActiveItem = Moralis.Object.extend("ActiveItem");

		const activeItem = new ActiveItem();
		activeItem.set("marketplaceAddress", req.object.get("address"));
		activeItem.set("nftAddress", req.object.get("nftAddress"));
		activeItem.set("tokenId", req.object.get("tokenId"));
		activeItem.set("seller", req.object.get("seller"));
		activeItem.set("price", req.object.get("price"));

		logger.info(
			`Adding Item: \n\tNFT Address: ${req.object.get(
				"address"
			)}\n\tToken ID: ${req.object.get("tokenId")}`
		);

		await activeItem.save();
	}
});

Moralis.Cloud.afterSave("ItemRemoved", async (req) => {
	const confirmed = req.object.get("confirmed");
	const logger = Moralis.Cloud.getLogger();
	if (confirmed) {
		const ActiveItem = Moralis.Object.extend("ActiveItem");
		const query = new Moralis.Query(ActiveItem);
		query.equalTo("marketplaceAddress", req.object.get("address"));
		query.equalTo("nftAddress", req.object.get("nftAddress"));
		query.equalTo("tokenId", req.object.get("tokenId"));

		const removedItem = await query.first();

		if (removedItem) {
			logger.info(
				`Removing Item: \n\tNFT Address: ${req.object.get(
					"address"
				)}\n\tToken ID: ${req.object.get("tokenId")}`
			);
			await removedItem.destroy();
		}
	}
});

Moralis.Cloud.afterSave("ItemBought", async (req) => {
	const confirmed = req.object.get("confirmed");
	const logger = Moralis.Cloud.getLogger();
	if (confirmed) {
		const ActiveItem = Moralis.Object.extend("ActiveItem");
		const query = new Moralis.Query(ActiveItem);
		query.equalTo("marketplaceAddress", req.object.get("address"));
		query.equalTo("nftAddress", req.object.get("nftAddress"));
		query.equalTo("tokenId", req.object.get("tokenId"));
		query.equalTo("price", req.object.get("price"));

		const boughtItem = await query.first();

		if (boughtItem) {
			logger.info(
				`Removing Item: \n\tNFT Address: ${req.object.get(
					"address"
				)}\n\tToken ID: ${req.object.get("tokenId")}`
			);
			await boughtItem.destroy();
		}
	}
});

Moralis.Cloud.afterSave("ItemUpdated", async (req) => {
	const confirmed = req.object.get("confirmed");
	const logger = Moralis.Cloud.getLogger();
	if (confirmed) {
		const ActiveItem = Moralis.Object.extend("ActiveItem");
		const query = new Moralis.Query(ActiveItem);
		query.equalTo("marketplaceAddress", req.object.get("address"));
		query.equalTo("nftAddress", req.object.get("nftAddress"));
		query.equalTo("tokenId", req.object.get("tokenId"));

		const updatedItem = await query.first();

		updatedItem.set("price", req.object.get("price"));

		logger.info(
			`Updating Item: \n\tNFT Address: ${req.object.get(
				"address"
			)}\n\tToken ID: ${req.object.get("tokenId")}`
		);

		await updatedItem.save();
	}
});
