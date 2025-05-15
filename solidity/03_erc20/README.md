下面是一个**结构清晰、内容完整的 `README.md` 教学文档**，适合初学者从零掌握 ERC20 编写、部署、交互，包含：

* 标准代币实现（固定总量 / 可增发）
* 合约与 ERC20 的交互（approve、transferFrom）
* Lock 锁仓合约应用（实战）
* 完整脚本说明（部署、授权、锁仓、提取）

---

# ERC20 学习与实战指南

本工程旨在帮助你快速掌握 Solidity 中 ERC20 代币的编写、部署与合约交互，涵盖以下内容：

* 固定总量的标准 ERC20 实现
* 可增发的 ERC20（含权限控制）
* ERC20 与其他合约交互（如锁仓）
* 使用 Hardhat 脚本部署、授权、存入、提取
* 最佳实践与安全建议

---

## 一、安装依赖 & 初始化 Hardhat 项目

```bash
mkdir erc20 && cd erc20
npm init -y
npm install --save-dev hardhat
npx hardhat init
```

选择 `Create a JavaScript project`，然后安装依赖：

```bash
npm install @openzeppelin/contracts
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

---

## 二、ERC20 固定总量版本（不可增发）

文件：`contracts/XYZTokenFixed.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract XYZTokenFixed is ERC20 {
    constructor(uint256 initialSupply) ERC20("XYZ Token", "XYZ") {
        _mint(msg.sender, initialSupply);
    }
}
```

说明：

* 部署时一次性铸造全部代币
* 没有增发、销毁、权限控制功能
* 适合 Meme、DAO、一次性分发型代币

---

## 三、ERC20 可增发版本（带权限）

文件：`contracts/XYZTokenMintable.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract XYZTokenMintable is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("XYZ Token", "XYZ") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
```

说明：

* 初始部署铸造一部分
* owner 可增发代币
* 可后续调用 `transferOwnership()` 或 `renounceOwnership()` 去中心化控制权

---

## 四、ERC20 与合约交互实战：锁仓合约 Lock

文件：`contracts/Lock.sol`
说明：将 XYZ Token 锁仓到指定时间，owner 解锁提取

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Lock is Ownable {
    IERC20 public immutable token;
    uint256 public unlockTime;
    uint256 public totalLocked;

    event Deposited(address indexed from, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed to, uint256 amount, uint256 timestamp);

    constructor(address tokenAddress, uint256 _unlockTime) Ownable(msg.sender) {
        require(block.timestamp < _unlockTime, "Unlock time must be in future");
        token = IERC20(tokenAddress);
        unlockTime = _unlockTime;
    }

    function deposit(uint256 amount) external onlyOwner {
        // owner 需要先 approve 给 Lock 合约
        bool success = token.transferFrom(msg.sender, address(this), amount);
        require(success, "Transfer failed");

        totalLocked += amount;
        emit Deposited(msg.sender, amount, block.timestamp);
    }

    function withdraw() external onlyOwner {
        require(block.timestamp >= unlockTime, "Too early");
        uint256 amount = totalLocked;
        totalLocked = 0;

        bool success = token.transfer(owner(), amount);
        require(success, "Withdraw failed");

        emit Withdrawn(owner(), amount, block.timestamp);
    }
}
```

---

## 五、部署脚本：`scripts/deploy.js`

部署 `XYZToken` 和 `Lock`，并保存地址到 `config.js`

```javascript
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const XYZToken = await hre.ethers.getContractFactory("XYZTokenMintable");
    const token = await XYZToken.deploy(hre.ethers.parseUnits("1000000", 18));
    await token.waitForDeployment();
    const tokenAddress = token.target;

    const now = Math.floor(Date.now() / 1000);
    const unlockTime = now + 300; // 5分钟后解锁

    const Lock = await hre.ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(tokenAddress, unlockTime);
    await lock.waitForDeployment();
    const lockAddress = lock.target;

    const configContent = `module.exports = {\n  tokenAddress: "${tokenAddress}",\n  lockAddress: "${lockAddress}"\n};\n`;
    fs.writeFileSync(path.join(__dirname, "config.js"), configContent);
}

main().catch(console.error);
```

---

## 六、交互脚本

### 1. 授权并存入锁仓：`scripts/deposit.js`

```javascript
const hre = require("hardhat");
const config = require("./config");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    const token = await hre.ethers.getContractAt("XYZTokenMintable", config.tokenAddress);
    const lock = await hre.ethers.getContractAt("Lock", config.lockAddress);

    const amount = hre.ethers.parseUnits("100", 18);

    await token.approve(lock.target, amount);
    await lock.deposit(amount);
    console.log("Deposited 100 XYZ to Lock");
}

main().catch(console.error);
```

### 2. 解锁并提取代币：`scripts/withdraw.js`

```javascript
const hre = require("hardhat");
const config = require("./config");

async function main() {
    const lock = await hre.ethers.getContractAt("Lock", config.lockAddress);
    const unlockTime = await lock.unlockTime();
    const now = Math.floor(Date.now() / 1000);

    const waitSec = Number(unlockTime) - now;
    if (waitSec > 0) {
        console.log(`⏳ Too early. Wait ${waitSec} seconds`);
        return;
    }

    await lock.withdraw();
    console.log("✅ Withdraw successful");
}

main().catch(console.error);
```

---

## 七、ERC20 常见函数与权限对比

| 函数名            | 权限要求       | 描述           |
| -------------- | ---------- | ------------ |
| `transfer`     | 用户自己       | 向他人转账        |
| `approve`      | 用户自己       | 授权某个地址花费自己代币 |
| `transferFrom` | 被授权人       | 使用授权额度进行转账   |
| `_mint`        | 通常仅限 owner | 铸造新代币        |
| `_burn`        | 用户或 owner  | 销毁代币         |

---

## 八、推荐实践场景

| 场景            | 推荐方案                  |
| ------------- | --------------------- |
| Meme/社区代币     | 使用 `XYZTokenFixed`    |
| 平台币 / 激励发行控制  | 使用 `XYZTokenMintable` |
| DAO 管理、多角色权限  | 使用 AccessControl 扩展   |
| 可暂停、防攻击、黑名单控制 | 使用 Pausable / 自定义黑名单  |

---

## 九、附录：OpenZeppelin 常用模块

| 模块名           | 功能说明        |
| ------------- | ----------- |
| ERC20         | 标准 ERC20 实现 |
| Ownable       | 单人权限控制      |
| AccessControl | 多角色权限控制     |
| Pausable      | 可暂停转账       |
| Burnable      | 支持销毁        |

---

## 十、进阶建议

* 编写 `test/Lock.js` 做单元测试覆盖
* 使用 `LockFactory` 支持多用户多锁仓
* 集成前端 DApp 与钱包连接
* 支持多阶段线性释放 / 签名授权提取等高级特性

---