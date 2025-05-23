// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract LockV2 {
    uint public unlockTime;
    address payable public owner;

    event DebugAddress(string label, address addr);
    event Withdrawal(uint amount, uint when);

    // TODO 为什么可升级合约需要有 initialize, 不能用 constructor？constructor 在什么时候执行的？
//    constructor(uint _unlockTime) payable {
    function initialize(uint _unlockTime) payable public { // TODO uint 占多少个字节？
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

        emit DebugAddress("msg.sender", msg.sender);
        emit DebugAddress("owner", owner);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }

    function version() public pure returns (string memory) {
        return "v2";
    }

    function getOwner() public view returns (address)  {
        return owner;
    }
}
