// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract OverflowAttack {
    mapping(address => uint256) public balances;

    constructor() payable {

    }
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) public {
        // TODO 溢出攻击
        unchecked {
            balances[msg.sender] -= amount;
        }
        // TODO amount 超过了合约的金额，transfer 会发生什么？
        // 如果 amount > address(this).balance，transfer() 会 自动 revert 整个交易。
        // Solidity 的 transfer() 内置 require(address(this).balance >= amount) 逻辑，本质上它就是一个安全转账。
        payable(msg.sender).transfer(amount);
    }
}
