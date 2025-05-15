const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("LockFactory", function () {
    async function deployFactoryFixture() {
        const ONE_HOUR = 60 * 60;
        const ONE_ETHER = ethers.parseEther("1");

        const [deployer, userAccount, attacker] = await ethers.getSigners();

        const LockFactory = await ethers.getContractFactory("LockFactory");
        const factory = await LockFactory.deploy();

        const unlockTime = (await time.latest()) + ONE_HOUR;

        return { factory, deployer, userAccount, attacker, unlockTime, ONE_ETHER };
    }

    describe("Deployment", function () {
        it("Should deploy LockFactory properly", async function () {
            const { factory } = await loadFixture(deployFactoryFixture);
            expect(await factory.getAddress()).to.properAddress;
        });
    });

    describe("Creating Lock Contracts", function () {
        it("Should revert if no ETH sent", async function () {
            const { factory, unlockTime, userAccount } = await loadFixture(deployFactoryFixture);
            await expect(
                factory.connect(userAccount).createLock(unlockTime, { value: 0 })
            ).to.be.revertedWith("Must send ETH");
        });

        it("Should emit LockCreated event", async function () {
            const { factory, unlockTime, ONE_ETHER, userAccount } = await loadFixture(deployFactoryFixture);

            await expect(factory.connect(userAccount).createLock(unlockTime, { value: ONE_ETHER }))
                .to.emit(factory, "LockCreated")
                .withArgs(anyValue, userAccount.address, unlockTime, ONE_ETHER);
        });

        it("Should create a Lock contract with correct unlockTime and owner = user", async function () {
            const { factory, unlockTime, ONE_ETHER, userAccount } = await loadFixture(deployFactoryFixture);

            const tx = await factory.connect(userAccount).createLock(unlockTime, { value: ONE_ETHER });
            const receipt = await tx.wait();
            const event = receipt.logs.find(log => log.eventName === "LockCreated");
            const lockAddress = event.args.lockAddress;

            const Lock = await ethers.getContractFactory("Lock");
            const lock = Lock.attach(lockAddress);

            expect(await lock.owner()).to.equal(userAccount.address);
            expect(await lock.unlockTime()).to.equal(unlockTime);
            expect(await ethers.provider.getBalance(lockAddress)).to.equal(ONE_ETHER);
        });
    });

    describe("Withdrawals (owner is user)", function () {
        it("Should revert if another user (attacker) tries to withdraw", async function () {
            const { factory, unlockTime, ONE_ETHER, userAccount, attacker } = await loadFixture(deployFactoryFixture);

            const tx = await factory.connect(userAccount).createLock(unlockTime, { value: ONE_ETHER });
            const receipt = await tx.wait();
            const lockAddress = receipt.logs.find(log => log.eventName === "LockCreated").args.lockAddress;

            const Lock = await ethers.getContractFactory("Lock");
            const lock = Lock.attach(lockAddress);

            await time.increaseTo(unlockTime);

            await expect(lock.connect(attacker).withdraw()).to.be.revertedWith("You aren't the owner");
        });

        it("Should revert if user tries to withdraw too early", async function () {
            const { factory, unlockTime, ONE_ETHER, userAccount } = await loadFixture(deployFactoryFixture);

            const tx = await factory.connect(userAccount).createLock(unlockTime, { value: ONE_ETHER });
            const receipt = await tx.wait();
            const lockAddress = receipt.logs.find(log => log.eventName === "LockCreated").args.lockAddress;

            const Lock = await ethers.getContractFactory("Lock");
            const lock = Lock.attach(lockAddress);

            await expect(lock.connect(userAccount).withdraw()).to.be.revertedWith("You can't withdraw yet");
        });

        it("Should allow user to withdraw after unlockTime", async function () {
            const { factory, unlockTime, ONE_ETHER, userAccount } = await loadFixture(deployFactoryFixture);

            const tx = await factory.connect(userAccount).createLock(unlockTime, { value: ONE_ETHER });
            const receipt = await tx.wait();
            const lockAddress = receipt.logs.find(log => log.eventName === "LockCreated").args.lockAddress;

            const Lock = await ethers.getContractFactory("Lock");
            const lock = Lock.attach(lockAddress);

            await time.increaseTo(unlockTime);

            await expect(lock.connect(userAccount).withdraw()).not.to.be.reverted;
        });

        it("Should transfer funds to user after withdraw", async function () {
            const { factory, unlockTime, ONE_ETHER, userAccount } = await loadFixture(deployFactoryFixture);

            const tx = await factory.connect(userAccount).createLock(unlockTime, { value: ONE_ETHER });
            const receipt = await tx.wait();
            const lockAddress = receipt.logs.find(log => log.eventName === "LockCreated").args.lockAddress;

            const Lock = await ethers.getContractFactory("Lock");
            const lock = Lock.attach(lockAddress);
            const lockAddr = await lock.getAddress();

            await time.increaseTo(unlockTime);

            await expect(() =>
                lock.connect(userAccount).withdraw()
            ).to.changeEtherBalances(
                [userAccount, lockAddr],
                [ONE_ETHER, -ONE_ETHER]
            );
        });
    });
});
