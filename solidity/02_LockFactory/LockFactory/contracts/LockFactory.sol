// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Lock.sol";

contract LockFactory {
    // TODO 事件如何定义？链下如何扫描？
    event LockCreated(address lockAddress, address owner, uint256 unlockTime, uint256 amount);

    function createLock(uint256 _unlockTime) external payable returns (address) {
        require(msg.value > 0, "Must send ETH");

        Lock newLock = new Lock{value: msg.value}(payable(msg.sender), _unlockTime);
        emit LockCreated(address(newLock), msg.sender, _unlockTime, msg.value);

        return address(newLock);
    }
}
