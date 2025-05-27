---

## 一、`mapping` 的基本语法

```solidity
mapping(address => uint256) public balances;
```

这是一个最常见的 `mapping`，表示：每个 `address` 对应一个 `uint256`。

---

## 二、Storage Layout 规则（核心）

对于：

```solidity
mapping(K => V) map;
```

Solidity 不将整个 mapping 存在一个 slot 中，而是每个 key 的值 **通过如下规则单独映射**：

### 存储位置计算公式：

```text
slot = keccak256(abi.encodePacked(key, mapping_slot))
```

其中：

* `key` 是映射中的具体键（如地址）；
* `mapping_slot` 是 mapping 在合约中的 slot 位置（通常是一个 `uint256`，表示在合约中是第几个变量）；

> ⚠️ 注意：`mapping` 本身所在的 slot（如 slot 0），**并不存任何实际数据**，只是作为偏移基准！

---

## 三、实战示例

```solidity
// 假设在合约中是第一个状态变量
mapping(address => uint256) public balances;
```

默认 `balances` 的 slot 是 `0`。

要读取 `balances[0x1234...]`，你需要计算：

```solidity
slot = keccak256(abi.encodePacked(padLeft(0x1234...), padLeft(0)))
```

你可以在 Hardhat 中这样读取：

```js
const key = ethers.utils.hexZeroPad(user.address, 32); // 补齐 32 字节
const slot = ethers.utils.solidityKeccak256(["bytes32", "uint256"], [key, 0]); // slot 0 是 mapping 位置

const raw = await ethers.provider.getStorageAt(contract.address, slot);
const value = ethers.BigNumber.from(raw);
console.log("Balance:", value.toString());
```

---

## 四、嵌套 Mapping 的存储方式

对于：

```solidity
mapping(address => mapping(uint256 => uint256)) public nested;
```

则访问：

```solidity
nested[A][B]
```

存储位置计算为：

```text
inner_slot = keccak256(abi.encodePacked(B, keccak256(abi.encodePacked(A, mapping_slot))))
```

也就是说，每多一层 mapping，就多一层哈希。

---

## 五、与数组的不同点

| 类型        | 是否顺序存储 | 是否可迭代 | 读取方式               |
| --------- | ------ | ----- | ------------------ |
| `mapping` | ❌（散列）  | ❌     | keccak256(键+槽位)    |
| `array`   | ✅ 顺序存  | ✅ 可迭代 | base\_slot + index |

---

## 六、可视化工具推荐

你可以用以下工具辅助查看 `mapping` 的 slot 布局：

* [eth.storage](https://eth.storage/)
* Hardhat + `getStorageAt`
* `solidity-storage-layout` 工具（CLI）

---

## 七、小结

| 问题                    | 答案                                                |
| --------------------- | ------------------------------------------------- |
| `mapping` 的值存哪儿？      | 按 key + slot 做 keccak256 哈希，存储在随机位置               |
| `mapping` 的 slot 是什么？ | 只是一个逻辑编号，真实值不存这里                                  |
| 怎么读取？                 | 用 `keccak256(abi.encodePacked(key, slot))` 得到具体位置 |

---