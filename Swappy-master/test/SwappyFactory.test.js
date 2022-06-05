const SwappyFactory = artifacts.require("SwappyFactory");
const BN = require("bn.js");
let chai = require("chai");
const truffleAssert = require("truffle-assertions");
chai.should();

contract("Swappy factory tests", () => {
  const token1 = "0x98Ac09d817C6e8F27FA5A182F433D3894DaCFf05";
  const token2 = "0x06009ac4D9bB10e359ea5a42Fd495F4B87d59137";
  const emptyAddress = "0x0000000000000000000000000000000000000000";
  beforeEach(async () => {
    this.factory = await SwappyFactory.new();
  });

  it("creating pair", async () => {
    let pairAddress = await this.factory.createPair.call(token1, token2);
    pairAddress.should.not.equal(emptyAddress);
  });

  it("get created pair address", async () => {
    await this.factory.createPair(token1, token2);
    let returnPairAddress = await this.factory.getPair.call(token1, token2);
    returnPairAddress.should.not.equal(emptyAddress);
  });
  it("get all pairs", async () => {
    await this.factory.createPair(token1, token2);
    let returnPairAddress = await this.factory.getAllPairs.call(0);
    returnPairAddress.should.not.equal(emptyAddress);
  });
  it("pairs number", async () => {
    await this.factory.createPair(token1, token2);
    let pairNumber = await this.factory.pairsNumber.call();
    pairNumber.eq(new BN(1)).should.be.true;
  });
  it("check for PairCreated event", async () => {
    let tx = await this.factory.createPair(token1, token2);
    truffleAssert.eventEmitted(tx, "PairCreated");
  });
  it("check if precalculated and actual deployed address are equal", async () => {
    let tx = await this.factory.createPair(token1, token2);
    truffleAssert.eventEmitted(tx, "PairCreated", (ev) => {
      return ev.pairAddress === ev.precalculatedAddress;
    });
  });
  it("check for reverts in createPair function for same token address",async ()=>{
    await truffleAssert.reverts(this.factory.createPair(token1,token1),"Swappy: TOKEN1_TOKEN2_IDENTICAL_ADDRESSES");
  })
  it("check for reverts in createPair function for token1 address(0)",async ()=>{
    await truffleAssert.reverts(this.factory.createPair(emptyAddress,token1),"Swappy: TOKEN1_0_ADDRESS");
  })
  it("check for reverts in createPair function for token2 address(0)",async ()=>{
    await truffleAssert.reverts(this.factory.createPair(token1,emptyAddress),"Swappy: TOKEN2_0_ADDRESS");
  })
  it("check for reverts in getPair function for same token address",async ()=>{
    await truffleAssert.reverts(this.factory.getPair(token1,token1),"Swappy: TOKEN1_TOKEN2_IDENTICAL_ADDRESSES");
  })
  it("check for reverts in getPair function for token1 address(0)",async ()=>{
    await truffleAssert.reverts(this.factory.getPair(emptyAddress,token1),"Swappy: TOKEN1_0_ADDRESS");
  })
  it("check for reverts in getPair function for token2 address(0)",async ()=>{
    await truffleAssert.reverts(this.factory.getPair(token1,emptyAddress),"Swappy: TOKEN2_0_ADDRESS");
  })
});
