// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract OutOfGasTest {
    uint256 public dummy;
    uint256[] public bigArray;
    mapping(uint256 => uint256) public bigMap;

    // Case 1: 无限循环（pure）
    function loopForever() public pure {
        while (true) {}
    }

    // Case 2: 大量 storage 写入（SSTORE）
    function writeMany(uint256 count) public {
        for (uint i = 0; i < count; i++) {
            dummy = i;
        }
    }

    // Case 3: 动态 storage array push
    function pushMany(uint256 count) public {
        for (uint i = 0; i < count; i++) {
            bigArray.push(i);
        }
    }

    // Case 4: emit 多事件
    event Ping(uint256 i);
    function emitMany(uint256 count) public {
        for (uint i = 0; i < count; i++) {
            emit Ping(i);
        }
    }

    // Case 5: 大量 storage map 写入
    function writeMap(uint256 count) public {
        for (uint i = 0; i < count; i++) {
            bigMap[i] = i;
        }
    }

    // Case 6: 创建大量合约（注意主网 gas 会炸）
    address[] public deployed;
    function createMany(uint count) public {
        for (uint i = 0; i < count; i++) {
            OutOfGasChild child = new OutOfGasChild();
            deployed.push(address(child));
        }
    }

    // Case 7: fallback 写 storage（适用于 receive 测试）
    fallback() external payable {
        dummy = block.timestamp;
    }

    receive() external payable {
        dummy = block.number;
    }

    // Case 8: 递归函数（栈深度 & gas）
    function recursive(uint256 depth) public returns (uint256) {
        if (depth == 0) return 1;
        return depth + recursive(depth - 1);
    }

    // Case 9: for 循环中多次 transfer（2300 gas 每次）
    function transferMany(address payable to, uint count) public payable {
        uint256 each = msg.value / count;
        for (uint i = 0; i < count; i++) {
            to.transfer(each);
        }
    }
}

// 用于 createMany 场景的最小合约
contract OutOfGasChild {
    uint256 public x = 1;
}
