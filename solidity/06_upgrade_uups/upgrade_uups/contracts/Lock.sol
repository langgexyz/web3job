// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

// TODO 理解继承、StorageLayout 如何影响继承的？
contract Lock is Initializable, UUPSUpgradeable, OwnableUpgradeable{
    uint public unlockTime;

    event Withdrawal(uint amount, uint when);

    function initialize(uint _unlockTime) public payable initializer {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        __Ownable_init(msg.sender);         // 初始化 Ownable
        __UUPSUpgradeable_init(); // 初始化 UUPS

        unlockTime = _unlockTime;
    }

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner(), "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        payable(owner()).transfer(address(this).balance);
    }

    // TODO internal 和 external 有什么关系？
    // UUPS 升级权限控制：必须由 owner 执行升级
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    // TODO private 和 Layout 有什么关系？
    // 可选：预留升级空间
    uint256[50] private __gap;
}
