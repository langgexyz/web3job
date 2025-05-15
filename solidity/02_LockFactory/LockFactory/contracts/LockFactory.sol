// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Lock.sol";

contract LockFactory {
    // TODO 事件如何定义？链下如何扫描？
    event LockCreated(address lockAddress, address owner, uint256 unlockTime, uint256 amount);

    // TODO createLock 和 createLock2 实现有什么区别？
    function createLock(uint256 _unlockTime) external payable returns (address) {
        require(msg.value > 0, "Must send ETH");

        // TODO new 的底层实现原理是什么？
        Lock newLock = new Lock{value: msg.value}(payable(msg.sender), _unlockTime);
        emit LockCreated(address(newLock), msg.sender, _unlockTime, msg.value);

        return address(newLock);
    }

    function createLock2(uint256 _unlockTime) external payable returns (address lockAddress) {
        require(msg.value > 0, "Must send ETH");

        // ABI 编码构造参数
        bytes memory constructorArgs = abi.encode(payable(msg.sender), _unlockTime);

        // 拼接 creationCode + 构造参数
        bytes memory bytecode = abi.encodePacked(type(Lock).creationCode, constructorArgs);

        assembly {
            // create(value, offset, size)
            lockAddress := create(callvalue(), add(bytecode, 0x20), mload(bytecode))
            if iszero(lockAddress) {
                revert(0, 0)
            }
        }

        emit LockCreated(lockAddress, msg.sender, _unlockTime, msg.value);
    }
}
