// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Layout {
    // ----------- 值类型变量 -----------
    uint256 public a;        // slot 0
    address public b;        // slot 1
    bool public c;           // slot 2（单独占 1 slot）

    // ----------- 打包变量示例 -----------
    uint128 public d;        // slot 3（低 16 字节）
    uint128 public e;        // slot 3（高 16 字节）

    // ----------- 固定数组 -----------
    uint256[3] public fixedArr; // slot 4, 5, 6

    // ----------- 动态数组 -----------
    uint256[] public dynArr;    // slot 7：length，数据起始 keccak256(7)

    // ----------- mapping -----------
    mapping(uint256 => uint256) public map; // slot 8，数据位置 keccak256(abi.encode(key, 8))

    // ----------- struct -----------
    struct User {
        uint256 id;
        address wallet;
    }

    User public user;        // slot 9 (id), slot 10 (wallet)
}
