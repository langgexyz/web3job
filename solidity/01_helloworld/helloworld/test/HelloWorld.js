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