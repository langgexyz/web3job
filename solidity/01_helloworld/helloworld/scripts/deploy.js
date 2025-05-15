async function main() {
    const HelloWorld = await ethers.getContractFactory("HelloWorld");
    const hello = await HelloWorld.deploy("Hello from deployment script!");

    const address = await hello.getAddress();

    console.log("HelloWorld deployed to:", address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});