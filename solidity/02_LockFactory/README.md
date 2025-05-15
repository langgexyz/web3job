# LockFactory 项目学习指南

通过本项目你将学习：

* 如何构建一个工厂合约（Factory）来批量部署 `Lock` 合约
* 如何使用 Hardhat 编写、测试和部署智能合约
* Solidity 构造函数参数的传递方式
* 使用 `loadFixture` 实现状态隔离的测试

---

## 项目结构预览

```
LockFactory/
├── contracts/
│   ├── Lock.sol
│   └── LockFactory.sol
├── scripts/
│   └── deploy.js
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

选择：**Create a JavaScript project**，回车使用默认配置

安装工具包：

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
[Lock.js](LockFactory%2Ftest%2FLock.js)  
[LockFactory.js](LockFactory%2Ftest%2FLockFactory.js)

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

### 本地部署

```bash
npx hardhat run scripts/deploy.js --network localhost
```

---