// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Victim {
    mapping(address => uint256) public balances;

    function deposit() public payable {
        console.log("Victim contract received deposit of", msg.value, "from", msg.sender);
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Victim: Insufficient user balance");
        require(address(this).balance >= amount, "Victim: Contract has insufficient ETH");

        console.log("Victim contract transferring", amount, "ETH to", msg.sender);
//        payable(msg.sender).transfer(amount);
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] -= amount;
        console.log("Victim contract balance for user:", msg.sender, "after withdrawal:", balances[msg.sender]);
    }
}
