// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyGameAssets is ERC1155, Ownable {
    constructor() ERC1155("https://example.com/api/item/{id}.json") Ownable(msg.sender){
    }

    // TODO data 有什么作用？
    // 作为附加的元数据或指令，在 NFT 被转移到合约地址时，传递给接收方合约使用。
    // 如果你把 NFT 转入另一个合约，接收方可以通过 data 得知额外信息。
    function mint(address to, uint256 id, uint256 value, bytes memory data) public onlyOwner {
        _mint(to, id, value, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory values, bytes memory data) public onlyOwner {
        _mintBatch(to, ids, values, data);
    }
}
