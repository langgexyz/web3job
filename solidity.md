---

## ✅ 一、基础类（10题）

1. **Solidity 中 memory 和 storage 有什么区别？**

    * `memory` 是临时内存（函数调用期间有效），`storage` 是永久存储（写入链上，需要 gas）。

2. **什么是 `msg.sender` 和 `msg.value`？**

    * `msg.sender` 是当前调用者地址；`msg.value` 是调用时发送的 ETH 数量（单位 wei）。

3. **Solidity 中的 fallback 和 receive 有什么区别？**

    * `receive()` 专用于接收 ETH 时调用，若无 data；
    * `fallback()` 在无匹配函数或有 data 且无 receive 函数时触发。

4. **合约之间如何调用？使用 call 和 interface 有何区别？**

    * `interface` 是静态调用（类型安全）；
    * `call` 是动态底层调用（可用于升级代理等，但不安全）。

5. **什么是事件（event）？作用是什么？**

    * 事件用于链上日志记录，可供前端监听状态更新，不消耗 storage。

6. **如何实现函数的访问控制？**

    * 使用 `modifier`，例如 `onlyOwner` 修饰器配合 `Ownable` 模块。

7. **Solidity 中 uint 和 int 的默认位数是多少？**

    * 默认是 `uint256` 和 `int256`。

8. **如何防止溢出？（overflow / underflow）**

    * 使用 `SafeMath`（<0.8.0）；0.8.0+ 默认内置检查。

9. **什么是视图函数（view）和纯函数（pure）？**

    * `view`：只读 state，不改状态；
    * `pure`：只使用参数，完全与链状态无关。

10. **合约部署后还能不能改代码？**

    * 不能直接改，但可以通过代理合约实现「升级逻辑」。

---

## ✅ 二、进阶类（10题）

1. **Solidity 如何实现合约升级？常用模式有哪些？**

    * 使用代理合约，如 Transparent Proxy、UUPS、Beacon Proxy。

2. **什么是 delegatecall？和 call 有什么区别？**

    * `delegatecall` 用调用者的上下文执行别人的代码；`call` 是独立执行别人的代码。

3. **如何通过 CREATE2 实现合约地址预测？**

    * 利用公式 `address = keccak256(0xFF ++ sender ++ salt ++ keccak256(init_code))[12:]`。

4. **什么是 fallback 攻击？如何防止？**

    * fallback 回调合约进行 reentrancy（重入攻击），防御方式：使用 `checks-effects-interactions`。

5. **Solidity 中构造函数 constructor 有什么特殊点？**

    * 只能调用一次，在部署合约时执行。

6. **如何判断一个地址是合约还是 EOA？**

    * 使用 `address.code.length > 0`，但要小心部署中地址返回为 0。

7. **Solidity 中有哪些内联汇编用途？**

    * 高级优化、访问 storage slot、call data 处理。

8. **Solidity 合约如何接收 ETH？**

    * 实现 `receive()` 或 `fallback()` 函数，配合 `payable` 修饰。

9. **什么是 revert(), require(), assert() 三者的区别？**

    * `require`：条件判断，返还 gas；
    * `revert`：主动回滚；
    * `assert`：检查内部错误，不应该失败。

10. **如何防止重放攻击？**

    * 使用 `nonce` 控制每笔交易唯一性。

---

## ✅ 三、安全类（8题）

1. **什么是重入攻击？如何防范？**

    * 调用外部合约再更新状态就可能被攻击；防御用 modifier 或 reentrancy guard。

2. **合约如何避免被锁死（即 owner 丢失）？**

    * 设置 owner 可修改，添加紧急撤销机制（emergency withdraw）。

3. **Solidity 中的 tx.origin 有何风险？**

    * 不能用于权限验证，容易被 phishing 攻击替代，建议用 `msg.sender`。

4. **常见漏洞有哪些？**

    * 重入、溢出、delegatecall 被劫持、访问控制错误、DoS 等。

5. **如何安全发送 ETH？transfer 和 call 的区别？**

    * `transfer` 固定 gas（2300），新版本建议用 `call{value: x}("")` + 检查返回值。

6. **合约部署者怎么防止别人提前部署合约地址？**

    * 对 CREATE2 提前占位合约地址、合理选用 salt。

7. **合约中变量是否可以被前端用户读取？**

    * 是的，所有 `public` 和 `storage` 状态变量在链上可读。

8. **如何防止 selfdestruct 带来的攻击？**

    * CREATE2 部署的地址可被复用攻击，建议验证 codehash。

---

## ✅ 四、性能与优化（6题）

1. **怎样节省 gas？**

    * 减少 storage 写操作、使用 calldata、结构体打包、避免动态数组扩容。

2. **函数和变量定义顺序对 gas 有影响吗？**

    * 有，变量打包顺序影响存储布局。

3. **storage slot 如何分配？**

    * 按变量声明顺序依次排，打包小于 32 字节的变量可节省空间。

4. **用 mapping 还是数组？**

    * 查找频繁用 `mapping`；遍历频繁用 `array`。

5. **数组长度增加如何收费？**

    * 写入新的 storage slot 会消耗更多 gas。

6. **inline assembly 有哪些优化方式？**

    * 减少内存复制、手动控制 storage slot、使用 keccak256 手动计算变量位置。

---