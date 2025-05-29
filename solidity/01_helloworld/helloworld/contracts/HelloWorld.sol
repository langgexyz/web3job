// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    string public message;

    // TODO 一个事件可以有多少个 indexed？
    event SetMessage(address indexed sender, string oldMessage, string newMessage);

    // TODO 请思考 memory 是什么意思？有哪些存储方式？
    constructor(string memory _message) {
        message = _message;
    }

    function setMessage(string memory _message) public {
        string memory oldMessage = message;
        message = _message;
        emit SetMessage(msg.sender, oldMessage, _message);
    }

    function getMessage() public view returns (string memory) {
        return message;
    }
}