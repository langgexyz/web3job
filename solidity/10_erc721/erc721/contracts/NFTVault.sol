// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract NFTVault is IERC721Receiver {

    address public immutable nftContract;

    // TODO mapping 怎么存储的？变量有一个起始 slot no, 每个 key -> value, 在再起始 slot no 上面叠加？
    mapping(uint256 => address)  public depositedBy;

    // TODO constructor 在什么时候调用？部署的时候
    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    function deposit(uint256 tokenId) external {
        IERC721(nftContract).safeTransferFrom(msg.sender, address(this), tokenId);
        depositedBy[tokenId] = msg.sender;
    }

    function withdraw(uint256 tokenId) external  {
        require(depositedBy[tokenId] == msg.sender, "Not original owner");
        delete depositedBy[tokenId];
        IERC721(nftContract).safeTransferFrom(address(this), msg.sender, tokenId);
    }

    function onERC721Received(
        address /*operator*/,
        address /*from*/,
        uint256 /*tokenId*/,
        bytes calldata /*data*/
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
