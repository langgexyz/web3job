// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Proxy {
    uint public x; // TODO 请思考为什么这儿要定义一个 uint public x，可以尝试，屏蔽了，执行升级会发生什么？Storage Layout
    address public implementation;
    address public admin;

    constructor(address _impl) {
        implementation = _impl;
        admin = msg.sender;
    }

    function upgrade(address newImpl) external {
        require(msg.sender == admin, "Not admin");
        implementation = newImpl;
    }

    fallback() external payable {
        address impl = implementation;
        require(impl != address(0), "No implementation");

        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }

    receive() external payable {}
}
