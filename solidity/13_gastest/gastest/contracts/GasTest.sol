// contracts/GasTest.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// TODO 参数只读 → calldata，参数要改 → memory，要省 gas → external calldata。
contract GasTest {
    uint256 private dummy;

    // TODO 什么情况下用memory，什么情况下用calldata呢？
    function test1_public_memory(uint256[] memory arr) public returns (uint256) {
        dummy = arr.length;
        return dummy;
    }

    function test1_external_calldata(uint256[] calldata arr) external returns (uint256) {
        dummy = arr.length;
        return dummy;
    }

    function test1_public_calldata(uint256[] calldata arr) public returns (uint256) {
        dummy = arr.length;
        return dummy;
    }

    // TODO 在 test1_public_memory  基础上多了一次函数调用
    function test1_public_memory_external_calldata(uint256[] memory arr) external returns (uint256) {
        return this.test1_external_calldata(arr);
    }
}
