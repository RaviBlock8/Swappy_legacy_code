const SwappyFactory = artifacts.require("SwappyFactory");
const SwappyRouter = artifacts.require("SwappyRouter");
const ERC20Basic = artifacts.require("ERC20Basic");
const SwappyLibrary = artifacts.require("./libraries/SwappyLibrary")

module.exports = async function (deployer) {
  await deployer.deploy(SwappyFactory);
  let factoryInstance = await SwappyFactory.deployed();
  await deployer.deploy(SwappyLibrary);
  await deployer.link(SwappyLibrary, SwappyRouter);
  let address = await factoryInstance.address;
  await deployer.deploy(SwappyRouter, address);
  await deployer.deploy(ERC20Basic);
};