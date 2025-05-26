// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Lock is EIP712 {
    uint public unlockTime;

    event Withdrawal(uint amount, uint when);

    mapping(address => uint256) public nonces;

    string private constant SIGNING_DOMAIN = "Lock";
    string private constant SIGNATURE_VERSION = "1";
    // keccak256("Withdraw(address owner,uint256 unlockTime,uint256 nonce)")
    bytes32 private constant WITHDRAW_TYPE_HASH = keccak256("Withdraw(address owner,uint256 unlockTime,uint256 nonce)");

    constructor(uint _unlockTime) payable EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
    }

    function withdraw(uint256 amount, uint256 nonce, bytes memory signature) public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");

        bytes32 structHash = keccak256(abi.encode(
            WITHDRAW_TYPE_HASH,
            owner,
            unlockTime,
            nonce
        ));

        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = digest.recover(signature);

        require(signer == owner, "Invalid signature");
        require(nonces[signer] == nonce, "Invalid nonce");

        nonces[signer]++;


        emit Withdrawal(address(this).balance, block.timestamp);

        payable(msg.sender).transfer(address(this).balance);
    }
}
