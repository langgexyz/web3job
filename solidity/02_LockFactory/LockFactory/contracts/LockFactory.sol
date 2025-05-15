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

        // 1️⃣ ABI 编码构造函数参数（类型为 address, uint256）
        // 构造函数签名：constructor(address payable _owner, uint _unlockTime)
        bytes memory constructorArgs = abi.encode(payable(msg.sender), _unlockTime);

        // 2️⃣ 拼接 Lock 合约的 creationCode 与构造参数，形成完整部署代码（bytecode）
        bytes memory bytecode = abi.encodePacked(type(Lock).creationCode, constructorArgs);

        // 3️⃣ 使用内联汇编发起底层 CREATE 操作部署合约
        assembly {
            // callvalue(): 获取当前调用中附带的 ETH 金额（等价于 msg.value）
            // add(bytecode, 0x20): 跳过 bytes 开头的 32 字节长度字段，指向实际代码起始地址
            // mload(bytecode): 读取 bytecode 的长度（单位是字节，32 字节对齐）
            lockAddress := create(
                callvalue(),                 // 转入的 ETH 金额
                add(bytecode, 0x20),         // 合约部署代码的实际内存地址
                mload(bytecode)              // 合约部署代码的长度
            )

            if iszero(lockAddress) {
                // TODO revert 的作用是什么？
                revert(0, 0)
            }
        }

        emit LockCreated(lockAddress, msg.sender, _unlockTime, msg.value);
    }
}
