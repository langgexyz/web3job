// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract LockV1 is Initializable {
    uint public unlockTime;
    address payable public owner;

    event Withdrawal(uint amount, uint when);

    // TODO 为什么要使用initialize？不用 constructor？
    // constructor() 只在合约部署时执行一次，Proxy 调不到，initialize() 由 Proxy 调用，实际执行在 Proxy 上下文中
    // initializer 修饰符 确保只允许调用一次（相当于 constructor）
    function initialize(uint _unlockTime) public payable initializer {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }
}
