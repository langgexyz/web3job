---

## 一、简洁定义

| 项目                                     | 含义                       | 通俗理解       |
| -------------------------------------- | ------------------------ | ---------- |
| **ABI** (Application Binary Interface) | 合约的“接口定义”，描述函数名、参数类型、事件等 | 合约的“使用说明书” |
| **Bytecode**                           | 合约的“机器码”，EVM 能执行的二进制代码   | 合约的“可执行程序” |

---

## 二、ABI 是什么？

ABI 是一个 JSON 格式的数组，定义了合约中可以被调用的所有函数、事件、构造函数的接口。

### 示例：

```json
[
  {
    "inputs": [{"internalType": "uint256","name": "amount","type": "uint256"}],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
```

### 用途：

* 前端（如 ethers.js、web3.js）调用合约函数时必须依赖 ABI；
* ABI 不包含任何业务逻辑，只描述“函数长什么样”。

---

## 三、Bytecode 是什么？

Bytecode 是 Solidity 编译器把你的 `.sol` 文件编译之后生成的二进制代码，是 **部署到区块链上的可执行代码**。

### 示例（Hex 编码片段）：

```
0x608060405234801561001057600080fd5b506040516101...
```

### 用途：

* **部署合约时**，EVM 把 bytecode 写入链上；
* **验证合约时**，要确保源码编译后的 bytecode 与链上一致。

---

## 四、对比总结

| 项目      | ABI       | Bytecode           |
| ------- | --------- | ------------------ |
| 是什么     | 函数与事件的说明书 | 可执行的合约机器码          |
| 是否部署到链上 | ❌ 不部署     | ✅ 是部署上链的主体         |
| 是否供前端调用 | ✅ 前端必须依赖  | ❌ 不使用              |
| 是否人类可读  | ✅ 是 JSON  | ❌ 是机器码             |
| 是否可反编译  | ❌ 不包含逻辑   | ⚠️ 部分可反编译为 Yul/AST |

---

## 五、常见使用场景

| 场景                | 用到 ABI 吗 | 用到 Bytecode 吗 |
| ----------------- | -------- | ------------- |
| 部署合约到链上           | ❌        | ✅ 必须          |
| 前端调用合约函数          | ✅ 必须     | ❌             |
| 验证合约源码（Etherscan） | ✅        | ✅             |
| 调试合约事件、函数输入输出     | ✅        | ❌             |

---

## 六、如何获取它们（Hardhat 示例）

```js
const artifacts = await hre.artifacts.readArtifact("MyContract");

console.log("ABI:", artifacts.abi);
console.log("Bytecode:", artifacts.bytecode);
```

也可以直接在 `artifacts/contracts/MyContract.sol/MyContract.json` 文件中看到它们。

---