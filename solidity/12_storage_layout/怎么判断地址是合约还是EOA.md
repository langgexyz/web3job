---

## 一、判断逻辑

以太坊上：

* **EOA 地址**：由私钥控制，**没有代码（code size = 0）**
* **合约地址**：由合约创建交易生成，**有代码（code size > 0）**

---

## 二、使用方法（链上 & 脚本）

### 方法 1：Ethers.js 脚本方式（推荐）

```js
const { ethers } = require("hardhat");

async function isContract(address) {
    const code = await ethers.provider.getCode(address);
    return code !== "0x"; // code 长度大于0 表示是合约
}

async function main() {
    const address = "0xYourTargetAddress";
    const result = await isContract(address);
    console.log(`${address} is ${result ? "a contract" : "an EOA"}`);
}

main().catch(console.error);
```

---

### 方法 2：Solidity 合约内判断（不推荐在合约中强依赖）

```solidity
function isContract(address account) public view returns (bool) {
    return account.code.length > 0;
}
```

> 注意：**在合约构造阶段 `code.length == 0`**，所以如果你在构造函数里检查自己地址，会误判为 EOA。

---

## 三、实战建议

| 场景                    | 是否推荐用 `getCode()` 判断 |
| --------------------- | -------------------- |
| 钱包区分 EOA / 合约钱包       | ✅ 推荐                 |
| 自动识别合约地址（如 token、NFT） | ✅ 推荐                 |
| 合约内部限制只能 EOA 调用       | ⚠️ 慎用（容易被绕过）         |
| 合约构造函数判断自身            | ❌ 错误（code 为 0）       |

---

## 四、实用场景

* 判断某个地址是否是合约，避免向 EOA 调用 `transfer()` 报错；
* 防止合约被其他合约调用（`tx.origin` 反制失败时可加辅助判断）；
* 自动分析哪些地址是合约部署地址。

---

## 五、小结

| 方法                                | 是否安全  | 是否常用  |
| --------------------------------- | ----- | ----- |
| `provider.getCode(address)`       | ✅ 安全  | ✅ 推荐  |
| `address.code.length`（Solidity）   | ✅ 安全  | ✅     |
| `tx.origin == msg.sender`（绕过合约调用） | ❌ 不安全 | ⚠️ 慎用 |

---

非常棒的问题！你提到的：

> code size 是否为 0，跟 storageRoot 还是 codeHash 有关？

我们来明确说明：

---

## ✅ 答案：

> 判断一个地址是否是合约地址，看的是它的 **`codeHash`** 对应的 **code size 是否大于 0**，**与 `storageRoot` 无关**。

---

## 一、字段对比一览

| 字段            | 描述                               | 用途                      | 是否跟 code size 有关 |
| ------------- | -------------------------------- | ----------------------- | ---------------- |
| `codeHash`    | 合约代码的哈希（keccak256(bytecode)）     | 判断是否部署合约代码              | ✅ 有关             |
| `storageRoot` | Merkle Patricia Trie 的根，用于存储变量状态 | 读写 storage（mapping、变量等） | ❌ 无关             |

---

## 二、如何判断合约地址 vs EOA？

### 原理：

```js
const code = await provider.getCode(address);
if (code === "0x") {
    // 是 EOA（外部账户，没有合约代码）
} else {
    // 是合约地址（部署了 bytecode）
}
```

* 这个 `code` 实际上读取的是 `stateTrie[address].codeHash` 对应的代码；
* 如果 `codeHash == keccak256("")`，表示没有部署任何代码 → 也就是 EOA；
* 所以 code size 为 0 本质反映的是 `codeHash == keccak256("")`。

---

## 三、storageRoot 是做什么的？

* 它是合约账户的“存储区”根节点；
* 只有合约变量才会使用它，比如 `mapping`、`uint256`、`array`；
* EOA 虽然在状态树中有这个字段，但值为 `EMPTY_TRIE_ROOT`（即没有任何存储）；
* **但合约有没有 `storage`，跟 code size 没关系**（即使你一个状态变量都没有，也可以部署一个合约）。

---

## 四、验证例子（区块链浏览器）

你可以在 Etherscan 上随便找两个地址：

### 地址 A：EOA

* 没有合约代码（Code = "0x"）
* code size = 0
* `codeHash = keccak256("") = 0x...0000`

### 地址 B：合约地址

* 有代码（可查看源码或字节码）
* code size > 0
* codeHash = `keccak256(bytecode)` ≠ `keccak256('')`

---

## 五、小结

| 判断内容                 | 关联字段               | 正确判断方式                           |
| -------------------- | ------------------ | -------------------------------- |
| 是否是合约地址              | ✅ `codeHash`（间接反映） | ✅ 读取 `getCode(address)` 是否为 "0x" |
| 是否有变量存储              | ✅ `storageRoot`    | ✅ 合约执行后才有变化                      |
| code size 为 0 是否是合约？ | ❌ 不是合约（即为 EOA）     | ✅ 安全判断方式                         |

---