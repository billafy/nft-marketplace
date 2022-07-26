// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract BasicNft is ERC721 {
	string public constant TOKEN_URI = "https://ipfs.io/ipfs/bafkreic4owxijq2upy2za5uf3d7rg52kali6gxpf3v4eam3t4ry5lthlxe?filename=bhorang.json";
	uint256 private s_tokenCounter;

    event Minted(uint256 indexed tokenId);

	constructor() ERC721("Bhorang", "BHORANG") {
		s_tokenCounter = 0;
	}

	function mintNft() public {
		_safeMint(msg.sender, s_tokenCounter);
		emit Minted(s_tokenCounter);
		s_tokenCounter = s_tokenCounter + 1;
	}

	function tokenURI(uint256 tokenId) public override view returns (string memory) {
		require(_exists(tokenId), 'ERC721: Token ID does not exist');
		return TOKEN_URI;
	}

	function getTokenCounter() public view returns (uint256) {
		return s_tokenCounter;
	}
}