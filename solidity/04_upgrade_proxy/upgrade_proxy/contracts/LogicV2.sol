// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LogicV2 {
    uint public x;

    function setX(uint _x) public {
        x = _x * 2;
    }
}
