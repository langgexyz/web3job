# Web3 Solidity 全栈学习项目 🚀

本项目旨在系统性掌握 Solidity、Hardhat、合约升级、NFT、DeFi、安全与面试项目构建，适合准备 Web3 找工/面试的开发者。

> ✨ 全部模块均按阶段划分并编号，支持逐步精进，也可单独 clone 每个模块进行实战练习。

---

## 🧭 学习路径概览（阶段 + 模块）

### 第一阶段：基础语法与合约开发入门

| 模块目录             | 简介                              |
| ---------------- | ------------------------------- |
| `01_helloworld`  | Solidity 初体验，HelloWorld 合约部署与测试 |
| `02_LockFactory` | 创建合约、ETH 传递、事件发出与监听             |
| `03_erc20`       | 实现固定总量与可增发版 ERC20，权限控制设计        |

---

### 第二阶段：工程实践与合约升级机制

| 模块目录                | 简介                                   |
| ------------------- | ------------------------------------ |
| `04_event_indexer`  | 合约事件 + 链下监听器（ethers/subgraph）        |
| `05_upgrade`        | Transparent Proxy 升级机制（OpenZeppelin） |
| `06_upgrade_uups`   | UUPS 模式，可升级逻辑合约原理                    |
| `07_upgrade_beacon` | Beacon 模式，支持多实例合约共享逻辑                |

---

### 第三阶段：NFT / DeFi 应用开发

| 模块目录                    | 简介                           |
| ----------------------- | ---------------------------- |
| `08_nft_721`            | 创建和管理 ERC721 NFT，支持铸造、转账和元数据 |
| `09_permit_and_meta_tx` | `permit()` + gasless 签名交易流程  |
| `10_oracle_chainlink`   | Chainlink 预言机接入价格 / 随机数数据    |
| `11_dex`                | 构建 AMM 逻辑（Uniswap 简化版）       |
| `12_defi_lending`       | 简单借贷协议实现：存/贷/利息/清算机制         |
| `13_airdrop_and_merkle` | Merkle Tree 实现低成本空投防止重复领取    |

---

### 第四阶段：安全机制与 EVM 底层

| 模块目录                      | 简介                              |
| ------------------------- | ------------------------------- |
| `14_security_basics`      | 重入、整数溢出、权限控制等常见漏洞复现             |
| `15_reentrancy_guard`     | 实现 ReentrancyGuard 并对比实战效果      |
| `16_storage_layout`       | 存储槽位与升级合约兼容性分析                  |
| `17_tx_order_attack`      | MEV / Sandwich Attack 等交易顺序攻击模拟 |
| `18_evm_create_create2`   | CREATE / CREATE2 合约地址预测与使用      |
| `19_opcode_and_gas`       | Opcode 基础、Gas 成本与底层调用分析         |
| `20_delegatecall_vs_call` | delegatecall 实战与代理核心原理拆解        |

---

### 第五阶段：项目实战 + 面试展示

| 模块目录                    | 简介                       |
| ----------------------- | ------------------------ |
| `21_portfolio_nft_demo` | 面试可展示 NFT 项目（含铸造 + 展示）   |
| `22_lending_demo_ui`    | 前后端整合的借贷平台原型 DApp        |
| `23_dao_demo`           | 完整 DAO 治理：提案 + 投票 + 执行流程 |

---

### 📚 附加资料（面试八股题）

| 文件名               | 内容                       |
| ----------------- | ------------------------ |
| `面试题.md`          | 常见 Solidity + EVM 面试问题合集 |
| `evm八股文.md`       | EVM 深度八股文题及标准化答案         |
| `Solidity漏洞复现.md` | 高频漏洞复现脚本与讲解              |

---

## 🛠 技术栈说明

* Solidity `^0.8.0`
* Hardhat `^2.x`
* Ethers.js `v6`
* OpenZeppelin Contracts
* Chainlink（Oracle / VRF）
* The Graph（可选）
* TypeScript / JavaScript

---

## 📦 快速开始

```bash
# 安装 Hardhat
npm install --save-dev hardhat

# 初始化项目（建议每个子模块独立 init）
npx hardhat init
```

---

## 📌 建议学习方式

1. 按模块顺序学习，逐个完成合约编写 + 脚本部署 + 单元测试
2. 阅读每个模块的 `README.md`，理解目标与核心概念
3. 编写总结笔记（可 PR 到 docs/ 文件夹）

---
