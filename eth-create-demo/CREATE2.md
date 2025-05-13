好的，下面是你整个 **基于 CREATE2 的合约部署流程**的完整、清晰、可执行的 `README.md` 文档，适用于项目目录下使用，内容包括：

* 项目简介
* CREATE2 工厂合约部署
* 通过工厂合约部署 Lock 合约
* 地址预测
* 脚本结构说明
* 常见问题

---

## ✅ `README.md`（CREATE2 版本）

```markdown
# eth-create2-demo

本项目展示了如何使用 [CREATE2](https://eips.ethereum.org/EIPS/eip-1014) 实现在部署前**精确预测合约地址**，通过合约工厂统一部署并支持参数化部署逻辑。  
项目基于 [Hardhat](https://hardhat.org/) + [Ethers.js v6](https://docs.ethers.org/v6/) 实现。

---

## 📦 项目结构

```

eth-create-demo/
├── contracts/
│   ├── Lock.sol               # 目标合约（带 unlockTime 和 withdraw）
│   └── CREATE2Deployer.sol    # 工厂合约，用于使用 CREATE2 部署任意合约
├── scripts/
│   ├── deploy-create2.js      # 部署 CREATE2 工厂合约
│   ├── create2-deploy-lock.js # 使用 CREATE2 工厂部署 Lock 合约
│   └── withdraw\.js            # 提款测试脚本

````

---

## ⚙️ 安装依赖

```bash
npm install
````

---

## 🛠️ 编译合约

```bash
npx hardhat compile
```

---

## 🚀 部署流程

### 第一步：部署 CREATE2 工厂合约

```bash
npx hardhat run scripts/deploy-create2.js --network localhost
```

成功后你会看到输出：

```
✅ CREATE2 工厂部署成功
Factory address: 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
```

---

### 第二步：使用 CREATE2 工厂部署 Lock 合约

修改 `scripts/create2-deploy-lock.js` 中的 `factoryAddress` 为上一步输出地址。

然后运行：

```bash
npx hardhat run scripts/create2-deploy-lock.js --network localhost
```

输出示例：

```
📍 预计 Lock 地址: 0x5FC8d...
🚀 Lock 合约已部署至: 0x5FC8d...
```

---

## 🔐 Lock 合约说明

* 部署时设置一个未来时间戳 `unlockTime`
* 向合约转入 ETH（默认 0.01）
* 到达时间后，合约部署者可调用 `withdraw()` 提现

---

## 💰 测试提现

修改 `scripts/withdraw.js` 中的地址：

```js
const lockAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";
```

然后运行：

```bash
npx hardhat run scripts/withdraw.js --network localhost
```

若当前时间未到 unlockTime，会提示等待；否则提现成功并输出交易哈希。

---

## 📍 CREATE2 地址计算机制

合约地址由如下方式计算得出：

```
address = keccak256(
    0xff ++ deployingAddress ++ salt ++ keccak256(init_code)
)[12:]
```

只要：

* 工厂合约地址不变
* salt 相同
* 合约初始化字节码相同

→ 地址将保持不变 ✅

---

## 🧠 常见问题（FAQ）

### ❌ `TypeError: Cannot mix BigInt and other types`

说明你在 JS 中混用了 `BigInt - Number`，应使用：

```js
BigInt(now) < unlockTime
```

### ❌ `invalid BytesLike value (argument="data", value=null)`

说明你尝试访问了未初始化的 `getDeployTransaction().data`，请使用：

```js
const encodedParams = Contract.interface.encodeDeploy([arg]);
const initCode = concat([Contract.bytecode, encodedParams]);
```

### ❌ 工厂部署成功但 CREATE2 调用失败

* 检查构造参数是否合法（如 unlockTime > now）
* 检查 `value` 是否充足
* salt 是否重复部署过

---

## ✅ 下一步建议

* [ ] 将部署记录写入 deployment.json 自动存储
* [ ] 封装 CREATE2 工具模块：initCode + salt + address 一键生成
* [ ] 批量部署多个 Lock（不同 salt）
* [ ] 支持 `CREATE2 + Proxy` 模式部署可升级合约

---