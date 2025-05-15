当然可以，以下是你提供的 `README.md` 的优化版本，整体结构更清晰，语言更统一，保持专业技术文档风格，并去除了图标（根据你的偏好）。已补充 `createLock.js` 脚本执行说明并整理了结尾部分内容。

---

# LockFactory 项目学习指南

本项目展示了如何通过工厂模式批量部署 `Lock` 合约，适合学习以下内容：

* 构建支持参数传递的可支付工厂合约（Factory）
* 使用 Hardhat 编写、测试和部署智能合约
* Solidity 构造函数参数的传递方式
* 使用 `loadFixture` 实现测试环境快照与隔离
* 使用 `CREATE` 和 `CREATE2` 原理部署合约并预测地址

---

## 项目结构预览

```
LockFactory/
├── contracts/
│   ├── Lock.sol
│   └── LockFactory.sol
├── scripts/
│   ├── deploy.js
│   └── createLock.js
├── test/
│   ├── Lock.js
│   └── LockFactory.js
├── hardhat.config.js
├── package.json
└── README.md
```

---

## 第一步：初始化 Hardhat 项目

```bash
mkdir LockFactory && cd LockFactory
npm init -y
npm install --save-dev hardhat
npx hardhat init
```

选择 `Create a JavaScript project`，并使用默认配置。

安装 Hardhat toolbox：

```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

---

## 第二步：编写合约

### `contracts/Lock.sol`

```solidity
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Lock {
    uint public unlockTime;
    address payable public owner;

    event Withdrawal(uint amount, uint when);

    constructor(address payable _owner, uint _unlockTime) payable {
        require(block.timestamp < _unlockTime, "Unlock time should be in the future");
        unlockTime = _unlockTime;
        owner = _owner;
    }

    function withdraw() public {
        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);
        owner.transfer(address(this).balance);
    }
}
```

### `contracts/LockFactory.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Lock.sol";

contract LockFactory {
    event LockCreated(address lockAddress, address owner, uint256 unlockTime, uint256 amount);

    function createLock(uint256 _unlockTime) external payable returns (address) {
        require(msg.value > 0, "Must send ETH");
        Lock newLock = new Lock{value: msg.value}(payable(msg.sender), _unlockTime);
        emit LockCreated(address(newLock), msg.sender, _unlockTime, msg.value);
        return address(newLock);
    }
}
```

---

## 第三步：编写测试用例

测试代码请查看：

* [`test/Lock.js`](./test/Lock.js)
* [`test/LockFactory.js`](./test/LockFactory.js)

---

## 第四步：部署脚本

路径：`scripts/deploy.js`

```js
async function main() {
  const LockFactory = await ethers.getContractFactory("LockFactory");
  const factory = await LockFactory.deploy();
  console.log("LockFactory deployed to:", await factory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

---

## 第五步：配置 Hardhat

`hardhat.config.js`

```js
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
};
```

---

## 第六步：运行项目

### 编译合约

```bash
npx hardhat compile
```

### 运行测试

```bash
npx hardhat test
```

### 启动本地节点

```bash
npx hardhat node
```

### 本地部署工厂合约

```bash
npx hardhat run scripts/deploy.js --network localhost
```

### 创建 Lock 合约实例（需先部署好 LockFactory）

```bash
npx hardhat run scripts/createLock.js --network localhost
```

---

## 附：合约地址生成原理

### CREATE 地址生成公式

```solidity
address = keccak256(rlp.encode([sender, nonce]))[12:]
```

说明：

* `sender`：部署方地址（EOA 或合约）
* `nonce`：部署方地址的交易计数器
* `rlp.encode`：RLP 编码序列化
* `[12:]`：取最后 20 字节作为合约地址

特点：

* 地址与 nonce 强相关，不可预先计算
* 不支持 salt，适合常规部署场景

---

### CREATE2 地址生成公式

```solidity
address = keccak256(0xff ++ sender ++ salt ++ keccak256(init_code))[12:]
```

说明：

* `0xff`：CREATE2 特有标识前缀（1 字节）
* `sender`：部署合约的工厂地址
* `salt`：用户自定义的 `bytes32` 值
* `init_code`：完整部署字节码（`creationCode + constructor args`）

特点：

* 地址可预计算
* 不可重复部署相同的 `salt + init_code`
* 广泛用于钱包工厂、模块部署、代理合约等场景

---

## CREATE 和 CREATE2 对比

| 项目        | CREATE           | CREATE2                                |
| --------- | ---------------- | -------------------------------------- |
| 地址生成方式    | `sender + nonce` | `sender + salt + keccak256(init_code)` |
| 是否可预测地址   | 否                | 是                                      |
| 是否支持 salt | 否                | 是                                      |
| 是否可重复部署   | 是（nonce 增加）      | 否（salt+code 相同即冲突）                     |
| 应用场景      | 常规部署、ERC20、DEX 等 | 钱包工厂、模块系统、合约地址预先绑定                     |

---