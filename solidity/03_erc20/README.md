本工程旨在帮助你快速上手 Solidity 编写和部署 ERC20 代币，包含以下内容：

* 固定总量的标准 ERC20
* 可增发的 ERC20（含权限控制）
* 无权限 VS 有权限设计对比
* 使用 Hardhat 部署、测试

---

## 一、安装依赖 & 初始化 Hardhat

```bash
mkdir erc20 && cd erc20
npm init -y
npm install --save-dev hardhat
npx hardhat init
```

选择 Create a JavaScript project，然后安装依赖：

```bash
npm install @openzeppelin/contracts
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

---

## 二、ERC20 固定总量版本（不可增发）

文件路径：`contracts/XYZTokenFixed.sol`

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

* 构造函数中一次性铸造全部代币
* 无任何增发、销毁、暂停、权限控制接口
* 适合完全去中心化用途，如 meme 币、社区代币等

---

## 三、ERC20 可增发版本（带权限）

文件路径：`contracts/XYZTokenMintable.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract XYZTokenMintable is ERC20, Ownable {
    constructor(uint256 initialSupply) ERC20("XYZ Token", "XYZ") {
        _mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
```

说明：

* 初始部署时铸造一部分代币
* 后续可以由 owner 增发
* 可通过 `transferOwnership` 或 `renounceOwnership` 移交或取消权限

---

## 四、部署脚本示例

文件路径：`scripts/deploy.js`

```javascript
const hre = require("hardhat");

async function main() {
  const XYZToken = await hre.ethers.getContractFactory("XYZTokenFixed"); // 或 XYZTokenMintable
  const token = await XYZToken.deploy(ethers.parseUnits("1000000", 18));

  await token.waitForDeployment();
  console.log("Token deployed to:", token.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

运行方式：

```bash
npx hardhat run scripts/deploy.js --network localhost
```

---

## 五、ERC20 常见函数与权限对比

| 函数名          | 权限需求      | 说明        |
| ------------ | --------- | --------- |
| transfer     | 用户自己      | 转账        |
| approve      | 用户自己      | 授权他人      |
| transferFrom | 被授权人      | 花费授权额度    |
| \_mint       | 仅限 owner  | 增发代币（如暴露） |
| \_burn       | 用户或 owner | 销毁代币（如定义） |

---

## 六、最佳实践建议

| 场景              | 推荐合约版本              |
| --------------- | ------------------- |
| 完全去中心化社区代币      | XYZTokenFixed       |
| 流动性逐步释放（平台币等）   | XYZTokenMintable    |
| 多角色权限（如 DAO 增发） | 使用 AccessControl 版本 |
| 需暂停控制、黑名单机制     | 使用 Pausable、黑名单扩展   |

---

## 七、测试建议（可选）

可在 `test/` 目录中添加测试脚本，验证如下内容：

* 初始总量是否正确
* transfer 功能是否正常
* mint 权限是否受到控制
* transferFrom 与授权是否匹配

---

## 附录：OpenZeppelin 模块参考

| 模块名           | 功能说明       |
| ------------- | ---------- |
| ERC20         | ERC20 标准实现 |
| Ownable       | 单管理员权限控制   |
| AccessControl | 多角色权限控制    |
| Pausable      | 可暂停交易      |
| Burnable      | 支持销毁代币     |

---