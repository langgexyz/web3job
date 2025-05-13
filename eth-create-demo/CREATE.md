明白了！你希望我把所有内容（项目说明、传统部署方式、Ignition模块、Ethers v6 兼容注意事项、FAQ等）**统一整合成一个完整的、连贯的 `README.md` 文件**，而不是分段解释。

下面是**最终整合版 README 文档**，适合直接复制粘贴到你的项目根目录下使用：

---

```markdown
# eth-create-demo

`eth-create-demo` 是一个基于 [Hardhat](https://hardhat.org/) + [Ethers.js v6](https://docs.ethers.org/v6/) 的最小以太坊合约部署项目，支持以下功能：

- 使用 `CREATE` 指令部署合约（带参数 + 附带 ETH）
- 地址预测（通过部署者地址和 nonce 计算）
- 兼容 Hardhat 最新的 [Ignition 模块化部署系统](https://hardhat.org/hardhat-ignition)
- 支持 Ethers v6 全新语法
- 适合学习以太坊地址生成、合约部署流程、脚本自动化

---

## 📁 项目结构

```

eth-create-demo/
├── contracts/
│   └── Lock.sol               # 默认合约（带解锁时间与提款功能）
├── scripts/
│   └── deploy.js              # 传统部署脚本（手动控制）
├── ignition/
│   └── modules/
│       └── Lock.js            # 使用 Ignition 方式部署合约
├── hardhat.config.js          # Hardhat 配置
├── package.json               # 项目依赖与命令

````

---

## ⚙️ 快速开始

### 1. 安装依赖

```bash
npm install
````

### 2. 编译合约

```bash
npx hardhat compile
```

---

## 🚀 使用传统脚本部署（CREATE）

### 1. 启动本地节点：

```bash
npx hardhat node
```

### 2. 另开终端，运行部署脚本：

```bash
npx hardhat run scripts/deploy.js --network localhost
```

示例输出：

```
Deployer address: 0x...
Nonce: 0
Contract deployed at: 0x...
Predicted address: 0x...
```

部署脚本中会自动传入构造参数 `unlockTime`（当前时间 + 5分钟）和部署时附带的 ETH（0.01 ETH）。

---

## 📜 Lock 合约说明

合约功能如下：

* 部署时设定 `unlockTime`，需为将来时间戳
* 合约接收 ETH，用作锁仓
* `withdraw()` 仅限合约部署者在解锁时间后调用
* 提款成功后触发 `Withdrawal` 事件

---

## 🧠 地址预测（CREATE）

本项目使用 `ethers.getCreateAddress({ from, nonce })` 来预测部署地址，其底层机制：

```
keccak256(rlp.encode([deployer, nonce])) → 取后 20 字节
```

适用于：

* 钱包工厂合约提前接收 ETH（counterfactual deploy）
* Uniswap 等项目中合约地址可预知

---

## 🧩 使用 Hardhat Ignition 部署

本项目内置支持 Hardhat 新的模块化部署方式 —— Ignition。

### 1. 启动本地节点：

```bash
npx hardhat node
```

### 2. 部署合约模块：

```bash
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

默认参数：

* `unlockTime = 2030-01-01`
* `lockedAmount = 1 Gwei`

Ignition 优点：

* 支持参数配置（可使用 `m.getParameter(...)`）
* 自动记录部署状态
* 遇到失败可恢复，无需重头部署

---

## ⚠️ Ethers v6 写法注意事项

| 功能           | Ethers v6 写法                                            |
| ------------ | ------------------------------------------------------- |
| 获取 signer 地址 | `deployer.address`                                      |
| 获取 nonce     | `ethers.provider.getTransactionCount(deployer.address)` |
| 解析 ETH 金额    | `ethers.parseEther("0.01")`                             |
| 获取合约地址       | `await contract.getAddress()`                           |
| 地址预测         | `ethers.getCreateAddress({ from, nonce })`              |

---

## ✅ 示例部署脚本：`scripts/deploy.js`

```js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const currentBlock = await ethers.provider.getBlock("latest");
  const unlockTime = currentBlock.timestamp + 300; // 当前时间 + 5 分钟

  const nonce = await ethers.provider.getTransactionCount(deployer.address);

  console.log("Deployer address:", deployer.address);
  console.log("Nonce:", nonce);

  const Lock = await ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, {
    value: ethers.parseEther("0.01"),
  });

  await lock.waitForDeployment();

  const deployedAddress = await lock.getAddress();
  console.log("Contract deployed at:", deployedAddress);

  if (ethers.getCreateAddress) {
    const predictedAddress = ethers.getCreateAddress({
      from: deployer.address,
      nonce: nonce,
    });
    console.log("Predicted address:", predictedAddress);
  }
}

main().catch(console.error);
```

---

## ❓ 常见问题 FAQ

### ❌ 报错：`Unlock time should be in the future`

说明传入的 `unlockTime` 小于或等于当前区块时间。建议加上 300 秒（5分钟）缓冲。

### ❌ 报错：`getTransactionCount is not a function`

这是因为你使用的是 Ethers v6，应改为：

```js
await ethers.provider.getTransactionCount(deployer.address)
```

### ❌ 合约地址与预测地址不一致？

部署失败后 `nonce` 会变化，请确保部署成功，或重新获取最新 `nonce` 后再预测。

---

## 📌 后续拓展建议

* [ ] 增加 `CREATE2` 部署对比（更强的地址控制）
* [ ] 增加工厂合约演示（合约内部 `new` 部署子合约）
* [ ] 集成 TypeChain 类型绑定（适配 TS 项目）
* [ ] 使用脚本自动验证部署状态 + 交互调用

---
