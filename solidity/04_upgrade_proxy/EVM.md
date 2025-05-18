# EVM 变量存储结构与 Storage Layout 实例解析

## 一、EVM 中变量是怎么存储的？

在 EVM（以太坊虚拟机）中，每个智能合约都有一块独立的、持久化的存储区域，底层可以抽象为一个哈希映射：

```solidity
mapping(bytes32 => bytes32) Storage;
```

* 键（key）是 bytes32：表示每个变量的槽位（slot）
* 值（value）是 bytes32：表示变量的实际内容
* 所有合约状态变量最终都会映射到某个 slot
* slot 编号从 0 开始，按变量声明顺序分配
* 动态数组、映射等使用 keccak256(slot) 或 keccak256(key . slot) 寻址
* 每个 slot 大小固定为 32 字节（256 bit）

## 二、Solidity 各类变量的存储规则

| 类型      | Slot 分布                            | 储存规则                        |
| ------- | ---------------------------------- | --------------------------- |
| 值类型     | 顺序递增或打包                            | 32 字节对齐或紧凑存储                |
| 定长数组    | 连续多个 slot                          | `arr[i] = slot + i`         |
| 动态数组    | slot 保存 length，数据从 keccak(slot) 开始 | `arr[i] = keccak(slot) + i` |
| mapping | slot 不变，key 的值在 keccak(key, slot)  | 非连续存储                       |
| struct  | 展开到多个 slot                         | 与普通变量等同                     |

## 三、变量分布示例（contracts/Layout.sol）

```solidity
uint256 public a;                // slot 0
address public b;                // slot 1
bool public c;                   // slot 2

uint128 public d;                // slot 3（低 16 字节）
uint128 public e;                // slot 3（高 16 字节）

uint256[3] public fixedArr;      // slot 4, 5, 6
uint256[] public dynArr;         // slot 7 (length), data: keccak256(7) + i

mapping(uint => uint) public map;  // slot 8, data: keccak256(key, 8)

struct User {
  uint256 id;
  address wallet;
}
User public user;               // slot 9 (id), 10 (wallet)
```

## 四、使用方式

1. 安装依赖

```bash
npm install
npx hardhat compile
```

2. 部署并初始化变量

```bash
npx hardhat run scripts/deploy.js
```

该步骤会执行 Layout.init() 方法，初始化所有变量为已知值。

3. 读取并验证存储槽

```bash
npx hardhat run scripts/read-storage.js
```

该脚本将输出每个变量所在的 slot 内容，并解析动态数组和 mapping 的实际位置。

## 五、示例输出（部分）

```
slot 0 (a): 42
slot 1 (b): 0xYourDeployerAddress
slot 2 (c): 1
slot 3 (d+e): 0x...160000000b
slot 4 (fixedArr[0]): 100
slot 7 (dynArr.length): 2
dynArr[0]: 1000
map[1]: 555
slot 10 (user.wallet): 0xYourDeployerAddress
```

## 六、代理合约中的变量布局注意事项

在使用 delegatecall 的可升级代理合约中，逻辑合约的状态变量会写入 Proxy 的 Storage：

* 变量布局必须保持对齐，不能插入新变量或更改顺序
* 可通过预留变量（如 `uint256[50] private __gap`）保留空间
* 推荐采用 EIP-1967 中定义的 slot 写法，避免 slot 冲突

## 七、参考资料

* Solidity 官方文档 - Storage Layout
  [https://docs.soliditylang.org/en/latest/internals/layout\_in\_storage.html](https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html)
* OpenZeppelin 升级插件指南
  [https://docs.openzeppelin.com/upgrades-plugins/1.x/](https://docs.openzeppelin.com/upgrades-plugins/1.x/)
* EIP-1967 Proxy Slot 标准
  [https://eips.ethereum.org/EIPS/eip-1967](https://eips.ethereum.org/EIPS/eip-1967)

---