好的，以下是你项目中基于 **Solidity `new` 关键字的工厂合约部署子合约** 的完整 `README.md`，适合放入项目中 `factory-new/` 子模块或主仓库的一个模块说明：

---

## ✅ `README.md`：工厂合约内部用 `new` 创建子合约

```markdown
# eth-factory-new-demo

本模块展示了以太坊合约如何通过 Solidity 中的 `new` 关键字，在合约内部动态部署子合约（工厂模式）。这是最常见的部署方式之一，适用于：

- 钱包工厂（每个用户独立实例）
- NFT / DAO 工厂
- 创建独立配置的合约池

---

## 🧱 项目结构

```

eth-create-demo/
├── contracts/
│   ├── Lock.sol              # 子合约：带 unlockTime 和 withdraw 功能
│   └── LockFactory.sol       # 工厂合约：使用 `new` 动态部署 Lock
├── scripts/
│   ├── deploy-lock-factory.js  # 部署 LockFactory 工厂合约
│   └── create-lock.js          # 调用工厂创建新的 Lock 合约

````

---

## ⚙️ 安装依赖

```bash
npm install
````

---

## 🔨 编译合约

```bash
npx hardhat compile
```

---

## 🚀 部署流程

### 第一步：部署 LockFactory 工厂合约

```bash
npx hardhat run scripts/deploy-lock-factory.js --network localhost
```

示例输出：

```
✅ LockFactory 已部署： 0x1234abcd...
```

---

### 第二步：使用工厂创建新的 Lock 合约

修改 `scripts/create-lock.js` 中的地址为你上一步部署的工厂地址：

```js
const factoryAddress = "0x1234abcd..."; // ✅ 替换为你实际部署地址
```

运行：

```bash
npx hardhat run scripts/create-lock.js --network localhost
```

输出示例：

```
🚀 调用工厂部署 Lock...
🎉 Lock 合约已部署： 0x5678efgh...
```

---

## 🔐 Lock 合约说明

* 构造函数要求传入 `unlockTime`（未来的时间戳）
* 部署时附带 ETH（示例为 0.01）
* 到期后部署者可调用 `withdraw()` 提现

---

## 📘 工厂合约说明

```solidity
function createLock(uint unlockTime) external payable returns (address) {
    Lock lock = new Lock{value: msg.value}(unlockTime);
    allLocks.push(address(lock));
    emit LockCreated(address(lock), msg.sender, unlockTime);
    return address(lock);
}
```

该函数会：

* 用 `new` 关键字部署一个新的 `Lock` 合约
* 将合约地址保存在数组中
* 触发 `LockCreated` 事件

---

## ✅ 工厂模式对比

| 模式        | 使用方式      | 地址可预测  | 场景                      |
| --------- | --------- | ------ | ----------------------- |
| `new`     | 工厂内部直接调用  | ❌ 不可预测 | 通用合约实例创建                |
| `CREATE2` | 使用盐 + 字节码 | ✅ 可预测  | 钱包、模块、counterfactual 部署 |

---

## 🧪 后续建议

* [ ] 添加 `withdraw-lock.js` 调用部署的 Lock 合约提款
* [ ] 工厂合约中加入 `mapping` 记录每个用户创建的 Lock
* [ ] 工厂返回部署地址供前端显示或 UI 可视化调用
* [ ] 自动记录部署历史（如写入 deployment.json）

---