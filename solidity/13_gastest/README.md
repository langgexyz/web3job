---

# Solidity calldata vs memory 用法与 Gas 优化指南

## 一、概述

在 Solidity 中，`calldata` 和 `memory` 是两种临时数据位置（data location），正确选择它们对 gas 成本和代码安全性影响极大。

本文通过实验数据、使用建议和最佳实践，帮助你掌握 `calldata` 与 `memory` 的使用时机与优化技巧。

---

## 二、核心对比表

| 特性      | calldata            | memory              |
| ------- | ------------------- | ------------------- |
| 是否可修改   | 否（只读）               | 是（可读写）              |
| 生命周期    | 函数调用期间（只读）          | 函数调用期间（读写）          |
| gas 成本  | 更省（不复制）             | 更贵（复制数据到内存）         |
| 适用函数修饰符 | `external`、`public` | `public`、`internal` |
| 常见用途    | 参数只读、批量转账、路由等       | 中间变量、数组操作、构造临时数据等   |

---

## 三、实验验证

通过部署以下合约并用脚本测试 gas 消耗：

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract GasTest {
    uint256 private dummy;

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

    function test1_public_memory_external_calldata(uint256[] memory arr) external returns (uint256) {
        return this.test1_external_calldata(arr);
    }
}
```

测试数据（数组长度 100）：

| 函数名                                     | Gas 消耗 | 说明                     |
| --------------------------------------- | ------ | ---------------------- |
| `test1_public_memory`                   | 81469  | calldata 拷贝到 memory，最贵 |
| `test1_external_calldata`               | 56860  | 直接读取 calldata，最省       |
| `test1_public_calldata`                 | 56860  | 与 external 等价          |
| `test1_public_memory_external_calldata` | 89886  | 先复制再调用，最贵              |

---

## 四、实战使用建议

| 使用场景          | 推荐参数类型     | 推荐修饰符                 |
| ------------- | ---------- | --------------------- |
| 外部调用函数，仅读取参数  | `calldata` | `external`            |
| 合约内部调用，参数需改动  | `memory`   | `public` / `internal` |
| 路由器、聚合器、批量处理等 | `calldata` | `external`            |
| 操作数组、排序、拼接等   | `memory`   | `internal`            |

---

## 五、核心原理理解

* `calldata` 是传入数据的只读引用，不占内存，最省 gas；
* `memory` 是临时内存，需要显式分配并拷贝数据，gas 昂贵；
* `public(uint[] memory)`：Solidity 自动从 calldata 拷贝到 memory；
* `external(uint[] calldata)`：直接使用 calldata，零复制。

---

## 六、最佳实践总结

| 目的           | 推荐写法                           |
| ------------ | ------------------------------ |
| 参数只读         | `calldata`                     |
| 参数需要改动       | `memory`                       |
| 外部调用，追求省 gas | `external(uint256[] calldata)` |
| 内部函数处理数据     | `internal(uint256[] memory)`   |

---

## 七、开发建议与参考配置

* 使用 `external + calldata` 优化大量外部数据处理
* 使用 `memory` 时要明确变量修改用途
* 配置建议（Hardhat）：

```ts
solidity: {
  version: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
```

---

## 八、参考资料

* Solidity 官方文档：[https://docs.soliditylang.org/en/latest/contracts.html#data-location](https://docs.soliditylang.org/en/latest/contracts.html#data-location)
* Hardhat 文档：[https://hardhat.org/](https://hardhat.org/)
* Ethereum StackExchange: calldata vs memory gas cost

---