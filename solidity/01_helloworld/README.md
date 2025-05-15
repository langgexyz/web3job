在本节中，你将完成一个完整的 Solidity 合约项目的初始化、开发、测试与部署流程，核心内容包括：

### 项目结构

* 创建了标准的 Hardhat 项目目录，包括 `contracts`、`scripts`、`test` 等子目录。

### 合约开发

* 编写了一个最基础的 `HelloWorld` 合约，支持构造函数初始化、读写字符串。

### 单元测试

* 使用内存链（in-memory Hardhat Network）进行快速单元测试验证合约功能。

### 部署脚本

* 使用 `scripts/deploy.js` 编写部署流程。
* 说明了使用内存链和持久化本地链（localhost）部署的区别。
* 强调了地址一致性与 nonce 相关，深入理解了合约地址生成机制。

---
## 项目结构预览

```
helloworld/
├── contracts/
│   └── HelloWorld.sol
├── scripts/
│   └── deploy.js
├── test/
│   └── HelloWorld.js
├── hardhat.config.js
├── package.json
└── README.md
```

## 第一步：初始化 Hardhat 项目

```bash
mkdir helloworld && cd helloworld
npm init -y
npm install --save-dev hardhat
npx hardhat init
```

选择：**Create a JavaScript project**，回车使用默认配置

然后安装依赖：

```bash
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

---

## 第二步：编写 `HelloWorld` 合约

路径：`contracts/HelloWorld.sol`

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    string public message;

    constructor(string memory _message) {
        message = _message;
    }

    function setMessage(string memory _message) public {
        message = _message;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
}
```

---

## 第三步：编写测试脚本

路径：`test/HelloWorld.js`

```javascript
const { expect } = require("chai");

describe("HelloWorld", function () {
  it("Should return the correct message", async function () {
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const hello = await HelloWorld.deploy("Hello, Web3!");

    expect(await hello.getMessage()).to.equal("Hello, Web3!");
  });

  it("Should update the message", async function () {
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const hello = await HelloWorld.deploy("Initial");

    await hello.setMessage("Updated");
    expect(await hello.getMessage()).to.equal("Updated");
  });
});
```

---

## 第四步：部署脚本

路径：`scripts/deploy.js`

```javascript
async function main() {
  const HelloWorld = await ethers.getContractFactory("HelloWorld");
  const hello = await HelloWorld.deploy("Hello from deployment script!");

  console.log("HelloWorld deployed to:", hello.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

---

## 第五步：配置 Hardhat

修改 `hardhat.config.js` 文件：

```js
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
};
```

---

## 第六步：运行测试和部署

编译合约：

```bash
npx hardhat compile
```

运行测试：

```bash
npx hardhat test
```
Hardhat 会：

1. 启动一个**全新的、本地内存区块链**（Hardhat Network），完全独立、不持久。
2. 编译合约 → 运行测试脚本 → 自动结束并销毁内存链。
3. 每个 `it(...)` 测试块之间，如果你使用了 `loadFixture(...)`，还会使用 snapshot 快照机制，进一步隔离每个测试的链状态。

启动本地节点：

```bash
npx hardhat node
```

本地部署：

```bash
npx hardhat run scripts/deploy.js --network localhost
```
若未指定 network，你会发现每次部署打印的合约地址是一样的，

```bash
npx hardhat run scripts/deploy.js
```
因为：
* 默认使用的是 **内置的 in-memory Hardhat 网络**，每次执行都会**从头启动一个干净链环境**（区块高度为 0，账户 nonce 为 0）。
* 所以部署合约使用的账户地址和 nonce 都是一样的，合约地址自然也就一样。

### 合约地址生成公式：

```
合约地址 = keccak256(rlp.encode([sender, nonce])) // 取最后20字节
```

---
