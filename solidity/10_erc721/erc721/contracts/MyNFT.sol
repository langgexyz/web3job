// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

// TODO 总量如何设置？
// ERC721 标准不限制总数，可以自己添加逻辑控制 maxSupply 和 mint 数量。

// TODO NFT metadata 描述信息如何设置？
// NFT 的 metadata（元数据）是描述 NFT 信息的重要部分，比如名称、描述、图片、属性等。ERC-721 标准通过 tokenURI(uint256 tokenId) 函数来提供某个 NFT 的 metadata 地址。元数据通常是一个返回 JSON 的 URL。
// {
//  "name": "熙哥的第一个NFT",
//  "description": "这是熙哥3岁时画的一张画，永久上链。",
//  "image": "https://example.com/image/1.png",
//  "attributes": [
//    {
//      "trait_type": "年龄",
//      "value": "3岁"
//    },
//    {
//      "trait_type": "画风",
//      "value": "童趣"
//    }
//  ]
//}

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
