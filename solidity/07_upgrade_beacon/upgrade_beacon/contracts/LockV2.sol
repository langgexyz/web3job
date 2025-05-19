// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./Lock.sol";

contract LockV2 is Lock {
    uint256 public value;

    function deposit() external payable {
        value += msg.value;
    }
}
