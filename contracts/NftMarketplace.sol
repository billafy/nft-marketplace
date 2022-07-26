// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import 'hardhat/console.sol';

error NftMarketplace__InvalidPrice();
error NftMarketplace__NotApproved();
error NftMarketplace__ItemAlreadyListed(address nftAddress, uint256 tokenId);
error NftMarketplace__NotOwner();
error NftMarketplace__ItemNotListed(address nftAddress, uint256 tokenId);
error NftMarketplace__ItemPriceNotMet(address nftAddress, uint256 tokenId, uint256 price);
error NftMarketplace__WithdrawFailed(address withdrawer);
error NftMarketplace__OwnerCannotBuy(address nftAddress, uint256 tokenId);

contract NftMarketplace {
	/* structs */

	struct Item {
		uint256 price;
		address seller;
	}

	/* variables */

	mapping(address => mapping(uint256 => Item)) private s_listings;
	mapping(address => uint256) private s_addressToAmountEarned;

	/* events */

	event ItemListed(address indexed seller, address indexed nftAddress, uint256 indexed tokenId, uint256 price);
	event ItemBought(address indexed buyer, address indexed nftAddress, uint256 indexed tokenId, uint256 price);
	event ItemRemoved(address indexed seller, address indexed nftAddress, uint256 indexed tokenId);
	event WithdrawSucceeded(address indexed withdrawer);
	event ItemUpdated(address indexed seller, address indexed nftAddress, uint256 indexed tokenId, uint256 price);

	/* modifiers */

	modifier isOwner(address nftAddress, uint256 tokenId, address sender) {
		IERC721 nft = IERC721(nftAddress);
		if(nft.ownerOf(tokenId) != sender) 
			revert NftMarketplace__NotOwner();
		_;
	}

	modifier isListed(address nftAddress, uint256 tokenId) {
		if(s_listings[nftAddress][tokenId].price <= 0) 
			revert NftMarketplace__ItemNotListed(nftAddress, tokenId);
		_;
	}

	modifier notListed(address nftAddress, uint256 tokenId) {
		if(s_listings[nftAddress][tokenId].price > 0) 
			revert NftMarketplace__ItemAlreadyListed(nftAddress, tokenId);
		_;
	}

	modifier isPriceValid(uint256 price) {
		if(price <= 0) 
			revert NftMarketplace__InvalidPrice();
		_;
	}

	/* main functions */

	function listItem(
		address nftAddress, 
		uint256 tokenId, 
		uint256 price
	) external isOwner(nftAddress, tokenId, msg.sender) notListed(nftAddress, tokenId) isPriceValid(price) {
		IERC721 nft = IERC721(nftAddress);
		if(nft.getApproved(tokenId) != address(this)) 
			revert NftMarketplace__NotApproved();
		s_listings[nftAddress][tokenId] = Item(price, msg.sender);
		emit ItemListed(msg.sender, nftAddress, tokenId, price);
	}

	function buyItem(
		address nftAddress, 
		uint256 tokenId
	) external payable isListed(nftAddress, tokenId) {
		Item memory item = s_listings[nftAddress][tokenId];
		if(msg.value != item.price) 
			revert NftMarketplace__ItemPriceNotMet(nftAddress, tokenId, item.price);
		if(msg.sender == item.seller) 
			revert NftMarketplace__OwnerCannotBuy(nftAddress, tokenId);
		s_addressToAmountEarned[item.seller] += item.price;
		delete s_listings[nftAddress][tokenId];
		IERC721 nft = IERC721(nftAddress);
		nft.safeTransferFrom(item.seller, msg.sender, tokenId);
		emit ItemBought(msg.sender, nftAddress, tokenId, item.price);
	}

	function removeItem(
		address nftAddress,
		uint256 tokenId	
	) external isOwner(nftAddress, tokenId, msg.sender) isListed(nftAddress, tokenId) {
		delete s_listings[nftAddress][tokenId];
		emit ItemRemoved(msg.sender, nftAddress, tokenId);
	}

	function updateItem(
		address nftAddress,
		uint256 tokenId,
		uint256 price	
	) external isOwner(nftAddress, tokenId, msg.sender) isListed(nftAddress, tokenId) isPriceValid(price) {
		s_listings[nftAddress][tokenId].price = price;
		emit ItemUpdated(msg.sender, nftAddress, tokenId, price);
	}

	function withdraw() external payable {
		uint256 amount = s_addressToAmountEarned[msg.sender];
		s_addressToAmountEarned[msg.sender] = 0;
		(bool success, ) = payable(msg.sender).call{value: amount}("");
		if(!success) 
			revert NftMarketplace__WithdrawFailed(msg.sender);
		emit WithdrawSucceeded(msg.sender);
	}

	/* view functions */

	function getListing(address nftAddress, uint256 tokenId) external view returns (Item memory) {
		return s_listings[nftAddress][tokenId];
	}

	function getAmountEarned() external view returns (uint256) {
		return s_addressToAmountEarned[msg.sender];
	}
}