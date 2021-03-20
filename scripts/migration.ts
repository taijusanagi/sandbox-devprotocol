import hre from "hardhat";

const main = async () => {
  const DevProtocolSandbox = await hre.ethers.getContractFactory("DevProtocolSandbox");
  const greeter = await DevProtocolSandbox.deployed();
  console.log("Greeter deployed to:", greeter.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
