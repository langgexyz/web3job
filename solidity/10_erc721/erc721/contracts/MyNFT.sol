// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

// 1. 数量如何控制？

contract MyNFT is ERC721, Ownable {
    uint256 private _nextTokenId;

    // TODO ERC721("MyNFT", "MyNFT") 和 Ownable(msg.sender) 顺序换一下有没有影响？
    // constructor() Ownable(msg.sender) ERC721("MyNFT", "MyNFT") {}
    // 执行顺序仍然是：先执行 ERC721 构造函数，再执行 Ownable 构造函数，因为：Solidity 总是按照继承声明顺序，从左到右调用父类构造函数
    // contract MyNFT is ERC721, Ownable {
    // 顺序已经确定了：ERC721 → Ownable
    constructor() ERC721("MyNFT", "MyNFT") Ownable(msg.sender) {
    }

    function mint(address to)  external onlyOwner {
        _safeMint(to, _nextTokenId++);
    }
}
