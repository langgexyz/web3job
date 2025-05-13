// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Lock.sol";

contract LockFactory {
    address[] public allLocks;

    event LockCreated(address lockAddress, address creator, uint unlockTime);

    function createLock(uint unlockTime) external payable returns (address) {
        Lock lock = new Lock{value: msg.value}(unlockTime);
        allLocks.push(address(lock));
        emit LockCreated(address(lock), msg.sender, unlockTime);
        return address(lock);
    }

    function getLocks() external view returns (address[] memory) {
        return allLocks;
    }
}
