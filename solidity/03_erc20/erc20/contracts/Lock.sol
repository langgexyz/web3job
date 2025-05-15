// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Lock - 锁定任意 ERC20 Token 到解锁时间后释放给 owner
contract Lock is Ownable {
    IERC20 public immutable token;
    uint256 public unlockTime;
    uint256 public totalLocked;

    event Deposited(address indexed from, uint256 amount, uint256 timestamp);
    event Withdrawn(address indexed to, uint256 amount, uint256 timestamp);

    /// @param tokenAddress ERC20 token 的合约地址（如 XYZToken）
    /// @param _unlockTime 解锁时间（时间戳）
    constructor(address tokenAddress, uint256 _unlockTime) Ownable(msg.sender) {
        require(block.timestamp < _unlockTime, "Unlock time should be in the future");

        token = IERC20(tokenAddress);
        unlockTime = _unlockTime;
    }

    /// @notice 存入代币到锁仓合约（必须先 approve）
    function deposit(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be > 0");

        // ✅ 将 owner（调用者）的代币转入本合约地址
        // 前提是 owner 已经对该合约调用 approve 授权本合约能转走代币
        bool success = token.transferFrom(msg.sender, address(this), amount);
        require(success, "Token transfer failed");

        totalLocked += amount;

        emit Deposited(msg.sender, amount, block.timestamp);
    }

    /// @notice 解锁时间后由 owner 提取代币
    function withdraw() external onlyOwner {
        require(block.timestamp >= unlockTime, "Too early to withdraw");
        require(totalLocked > 0, "Nothing to withdraw");

        uint256 amount = totalLocked;
        totalLocked = 0; // 先更新状态，防止重入攻击

        // ✅ 将合约中锁定的代币转回给 owner
        // 此处不需要 approve，因为合约转的是自己的代币
        bool success = token.transfer(owner(), amount);
        require(success, "Token transfer failed");

        emit Withdrawn(owner(), amount, block.timestamp);
    }
}
