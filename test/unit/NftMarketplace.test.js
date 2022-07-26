const { assert, expect } = require("chai");
const { ethers, deployments, getNamedAccounts, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat.config.js");

!developmentChains.includes(network.name)
	? describe.skip
	: describe("NftMarketplace", async () => {
			const PRICE = ethers.utils.parseEther("1");
			let nftMarketplace, buyerNftMarketplace, deployer, basicNft;

			beforeEach(async () => {
				deployer = (await getNamedAccounts()).deployer;
				await deployments.fixture();
				nftMarketplace = await ethers.getContract(
					"NftMarketplace",
					deployer
				);
				basicNft = await ethers.getContract("BasicNft", deployer);
				await basicNft.mintNft();
				await basicNft.approve(nftMarketplace.address, 0);
			});

			describe("list items", async () => {
				it("only allows the owner of nft to add listing item", async () => {
					await nftMarketplace.listItem(basicNft.address, 0, PRICE);
					const accounts = await ethers.getSigners();
					buyerNftMarketplace = await nftMarketplace.connect(
						accounts[1]
					);
					await expect(
						buyerNftMarketplace.listItem(basicNft.address, 0, PRICE)
					).to.be.revertedWith("NftMarketplace__NotOwner");
				});

				it("does not list a listed item again", async () => {
					await nftMarketplace.listItem(basicNft.address, 0, PRICE);
					await expect(
						nftMarketplace.listItem(basicNft.address, 0, PRICE)
					).to.be.revertedWith("NftMarketplace__ItemAlreadyListed");
				});

				it("reverts if price is invalid", async () => {
					await expect(
						nftMarketplace.listItem(basicNft.address, 0, 0)
					).to.be.revertedWith("NftMarketplace__InvalidPrice");
				});

				it("emits item listed event", async () => {
					await expect(
						nftMarketplace.listItem(basicNft.address, 0, PRICE)
					).to.emit(nftMarketplace, "ItemListed");
				});

				it("adds new item to the listing", async () => {
					await nftMarketplace.listItem(basicNft.address, 0, PRICE);
					const item = await nftMarketplace.getListing(
						basicNft.address,
						0
					);
					assert.equal(item.price.toString(), PRICE.toString());
				});

				it("reverts when address is not approved", async () => {
					await basicNft.approve(ethers.constants.AddressZero, 0);
					await expect(
						nftMarketplace.listItem(basicNft.address, 0, PRICE)
					).to.be.revertedWith("NftMarketplace__NotApproved");
				});
			});

			describe("buy item", async () => {
				it("reverts when an unlisted item is tried to be bought", async () => {
					await expect(
						nftMarketplace.buyItem(basicNft.address, 0)
					).to.be.revertedWith("NftMarketplace__ItemNotListed");
				});

				it("reverts when item price is not met", async () => {
					await nftMarketplace.listItem(basicNft.address, 0, PRICE);
					await expect(
						buyerNftMarketplace.buyItem(basicNft.address, 0)
					).to.be.revertedWith("NftMarketplace__ItemPriceNotMet");
				});

				it("reverts when item is bought by the owner itself", async () => {
					await nftMarketplace.listItem(basicNft.address, 0, PRICE);
					await expect(
						nftMarketplace.buyItem(basicNft.address, 0, {
							value: PRICE,
						})
					).to.be.revertedWith("NftMarketplace__OwnerCannotBuy");
				});

				it("emits item bought event", async () => {
					await nftMarketplace.listItem(basicNft.address, 0, PRICE);
					const accounts = await ethers.getSigners();
					buyerNftMarketplace = await nftMarketplace.connect(
						accounts[1]
					);
					await expect(
						buyerNftMarketplace.buyItem(basicNft.address, 0, {
							value: PRICE,
						})
					).to.emit(nftMarketplace, "ItemBought");
				});

				it("removes the listing", async () => {
					await nftMarketplace.listItem(basicNft.address, 0, PRICE);
					const accounts = await ethers.getSigners();
					buyerNftMarketplace = await nftMarketplace.connect(
						accounts[1]
					);
					await buyerNftMarketplace.buyItem(basicNft.address, 0, {
						value: PRICE,
					});
					const item = await nftMarketplace.getListing(
						basicNft.address,
						0
					);
					assert.equal(item.price.toString(), "0");
				});

				it("increases amount earned of the seller", async () => {
					const startingAmount =
						await nftMarketplace.getAmountEarned();
					await nftMarketplace.listItem(basicNft.address, 0, PRICE);
					const accounts = await ethers.getSigners();
					buyerNftMarketplace = await nftMarketplace.connect(
						accounts[1]
					);
					await buyerNftMarketplace.buyItem(basicNft.address, 0, {
						value: PRICE,
					});
					const endingAmount = await nftMarketplace.getAmountEarned();
					assert.equal(
						endingAmount.toString(),
						startingAmount.add(PRICE).toString()
					);
				});
			});

			describe("remove item", async () => {
				it("only allows the owner of nft to remove listing item", async () => {
					await nftMarketplace.listItem(basicNft.address, 0, PRICE);
					const accounts = await ethers.getSigners();
					buyerNftMarketplace = await nftMarketplace.connect(
						accounts[1]
					);
					await expect(
						buyerNftMarketplace.removeItem(basicNft.address, 0)
					).to.be.revertedWith("NftMarketplace__NotOwner");
				});

				it("reverts if the item is not listed", async () => {
					await expect(
						nftMarketplace.removeItem(basicNft.address, 0)
					).to.be.revertedWith("NftMarketplace__ItemNotListed");
				});

				it("emits item removed event", async () => {
					await nftMarketplace.listItem(basicNft.address, 0, PRICE);
					await expect(
						nftMarketplace.removeItem(basicNft.address, 0)
					).to.emit(nftMarketplace, "ItemRemoved");
				});

				it("removes the listing", async () => {
					await nftMarketplace.listItem(basicNft.address, 0, PRICE);
					await nftMarketplace.removeItem(basicNft.address, 0);
					const item = await nftMarketplace.getListing(
						basicNft.address,
						0
					);
					assert.equal(item.price.toString(), "0");
				});
			});

			describe("update item", async () => {
				it("only allows the owner of nft to update listing item", async () => {
					await nftMarketplace.listItem(basicNft.address, 0, PRICE);
					const accounts = await ethers.getSigners();
					buyerNftMarketplace = await nftMarketplace.connect(
						accounts[1]
					);
					await expect(
						buyerNftMarketplace.updateItem(
							basicNft.address,
							0,
							PRICE
						)
					).to.be.revertedWith("NftMarketplace__NotOwner");
				});

				it("reverts if the item is not listed", async () => {
					await expect(
						nftMarketplace.updateItem(basicNft.address, 0, PRICE)
					).to.be.revertedWith("NftMarketplace__ItemNotListed");
				});

				it("reverts if price is invalid", async () => {
					await nftMarketplace.listItem(basicNft.address, 0, PRICE);
					await expect(
						nftMarketplace.updateItem(basicNft.address, 0, 0)
					).to.be.revertedWith("NftMarketplace__InvalidPrice");
				});

				it("emits item updated event", async () => {
					await nftMarketplace.listItem(basicNft.address, 0, PRICE);
					await expect(
						nftMarketplace.updateItem(basicNft.address, 0, PRICE)
					).to.emit(nftMarketplace, "ItemUpdated");
				});

				it("updates the price of the listing", async () => {
					await nftMarketplace.listItem(basicNft.address, 0, PRICE);
					const newPrice = ethers.utils.parseEther("3");
					await nftMarketplace.updateItem(
						basicNft.address,
						0,
						newPrice
					);
					const item = await nftMarketplace.getListing(
						basicNft.address,
						0
					);
					assert.equal(item.price.toString(), newPrice.toString());
				});
			});

			describe("withdraw", async () => {
				it("resets the amount earned", async () => {
					await nftMarketplace.listItem(basicNft.address, 0, PRICE);
					const accounts = await ethers.getSigners();
					buyerNftMarketplace = await nftMarketplace.connect(
						accounts[1]
					);
					await buyerNftMarketplace.buyItem(basicNft.address, 0, {
						value: PRICE,
					});
					await nftMarketplace.withdraw();
					const amount = await nftMarketplace.getAmountEarned();
					assert.equal(amount.toString(), "0");
				});

				it("emits withdraw succeeded event", async () => {
					await expect(nftMarketplace.withdraw()).to.emit(
						nftMarketplace,
						"WithdrawSucceeded"
					);
				});

				it("transfers amount to sellers wallet", async () => {
					const startingBalance =
						await nftMarketplace.provider.getBalance(deployer);
					await nftMarketplace.listItem(basicNft.address, 0, PRICE);
					const accounts = await ethers.getSigners();
					buyerNftMarketplace = await nftMarketplace.connect(
						accounts[1]
					);
					await buyerNftMarketplace.buyItem(basicNft.address, 0, {
						value: PRICE,
					});

					const txnResponse = await nftMarketplace.withdraw();
					const txnReceipt = await txnResponse.wait(1);

					const { gasUsed, effectiveGasPrice } = txnReceipt;
					const gasCost = gasUsed.mul(effectiveGasPrice);

					const endingBalance =
						await nftMarketplace.provider.getBalance(deployer);

					console.log(gasCost.toString());

					assert.equal(
						startingBalance.add(PRICE).toString(),
						endingBalance.add(gasCost).toString()
					);
				});
			});
	  });
