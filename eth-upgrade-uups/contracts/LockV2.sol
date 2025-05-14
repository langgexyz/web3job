// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Lock.sol";

contract LockV2 is Lock {
    function getLeftTime() public view returns (uint) {
        if (block.timestamp >= unlockTime) return 0;
        return unlockTime - block.timestamp;
    }
}