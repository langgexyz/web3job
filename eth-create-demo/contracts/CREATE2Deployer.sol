// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// TODO 请思考 EOA 字节使用 create2 可以不？

contract CREATE2Deployer {
    event ContractDeployed(address addr, bytes32 salt);

    function deploy(bytes memory bytecode, bytes32 salt) public payable returns (address addr) {
        require(bytecode.length != 0, "Empty bytecode");

        assembly {
            addr := create2(
                callvalue(),
                add(bytecode, 0x20),
                mload(bytecode),
                salt
            )
        }

        require(addr != address(0), "CREATE2 failed");

        emit ContractDeployed(addr, salt);
    }

    function computeAddress(bytes32 salt, bytes32 bytecodeHash) external view returns (address) {
        return address(uint160(uint(keccak256(abi.encodePacked(
            bytes1(0xff),
            address(this),
            salt,
            bytecodeHash
        )))));
    }
}
