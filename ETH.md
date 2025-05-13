# ETH 知识梳理

## Solidity
- 逻辑设计
    - 函数结构（函数修饰符、fallback/receive）
    - 状态变量与作用域
    - 控制流程（if, for, while, try-catch）
    - 合约继承与接口实现
- 存储结构
    - storage / memory / calldata 区别
    - mapping、struct 的存储布局
    - Storage Slot 机制
    - 永久存储 vs 临时变量

## 合约
- 地址生成
    - CREATE vs CREATE2 的原理与应用
    - 预测合约地址（工厂合约、钱包合约）
- 升级方式
    - Transparent Proxy（透明代理）
    - UUPS Proxy
    - Beacon Proxy
    - 升级过程中的风险与 best practice
- 安全问题
    - 重入攻击（Reentrancy）
    - delegatecall 滥用
    - 溢出与 underflow（Solidity 0.8+ 自动处理）
    - 访问控制（Ownable、AccessControl）
    - 合约锁定、Selfdestruct 滥用

## 二层链路（L2）
- zk-Rollup
    - 零知识证明（zk-SNARK/zk-STARK）
    - 代表项目：zkSync、Scroll、StarkNet
    - 高安全性、即时最终性、成本较高
- 乐观 Rollup（Optimistic Rollup）
    - 延迟验证 + 挑战期机制
    - 代表项目：Arbitrum、Optimism
    - 与 EVM 高度兼容、成本低、最终性延迟
- 有哪些 L2？分别解决了哪些问题？
    - Rollup（ZK / Optimistic）：扩容
    - Validium：扩容 + 数据链下可用性
    - Plasma：退出机制复杂，已少用
    - 状态通道：点对点高频交易
    - 各类方案对比分析（安全性、兼容性、成本、速度）

## POS（共识层）
- 共识机制（Casper FFG + LMD GHOST）
    - 验证者质押机制
    - 出块者与投票机制
    - Slashing 惩罚与诚实激励
- MEV（最大可提取价值）
    - MEV 来源：套利、排序、夹击
    - PBS（Proposer-Builder Separation）方案
    - Flashbots 等 MEV 市场角色

## 安全问题
- DNS 被攻击了
    - 历史事件：Infura、Alchemy DNS 劫持
    - 影响：DApp 无法访问
    - 应对策略：使用 ENS、IPFS、运行自有节点
- 合约层漏洞
    - The DAO 攻击（重入）
    - Parity 多签漏洞（合约 selfdestruct）
    - 前端钓鱼（钱包签名绕过）
- 基础设施问题
    - RPC 泄露与注入
    - 区块同步被篡改（节点中间人攻击）
