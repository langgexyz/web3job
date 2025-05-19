const {ethers, upgrades} = require("hardhat");
const {beaconAddress} = require("./config.js")

async function main() {
    const LockV2 = await ethers.getContractFactory("LockV2")

    const tx = await upgrades.upgradeBeacon(beaconAddress, LockV2)
    await tx.waitForDeployment()

    const implementationAddress = await upgrades.beacon.getImplementationAddress(beaconAddress)
    console.log("implementationAddress", implementationAddress)
}

main().catch(console.error)