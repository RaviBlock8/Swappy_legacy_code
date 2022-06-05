const SwappyPair = artifacts.require("SwappyPair");
const ERC20 = artifacts.require("ERC20");
const TestERC20 = artifacts.require("TestERC20");
const truffleAssert = require("truffle-assertions");
let chai = require("chai");
chai.should();

contract("Swappy Pair tests", accounts => {
  let testToken1;
  let testToken2;
  beforeEach(async () => {
    testToken1 = await TestERC20.new();
    testToken2 = await TestERC20.new();
    let addressToken1 = await testToken1.address;
    let addressToken2 = await testToken2.address;
    this.pair = await SwappyPair.new();
    await this.pair.initialize(addressToken1, addressToken2);
    await testToken1.mint(accounts[0], 1000);
    await testToken1.mint(accounts[1], 1000);
    await testToken2.mint(accounts[0], 1000);
    await testToken2.mint(accounts[1], 1000);
  });

  it("verify token address", async () => {
    const pairToken1Address = await this.pair.token1.call();
    const pairToken2Address = await this.pair.token2.call();
    const addressToken1 = await testToken1.address;
    const addressToken2 = await testToken2.address;
    
    pairToken1Address.should.equal(addressToken1);
    pairToken2Address.should.equal(addressToken2);
  });

  it("verify mint function", async () => {
    const pairAddress = await this.pair.address;
    await testToken1.transfer(pairAddress, 200, {from: accounts[0]});
    await testToken2.transfer(pairAddress, 200, {from: accounts[0]});
    let balanceToken1Pair = await testToken1.balanceOf(pairAddress);
    let balanceToken2Pair = await testToken2.balanceOf(pairAddress);
    balanceToken1Pair.toNumber().should.equal(200);
    balanceToken2Pair.toNumber().should.equal(200);
    await this.pair.mint(accounts[0]);
    const liquidityTokensAccount0 = await this.pair.balanceOf.call(accounts[0]);
    liquidityTokensAccount0.toNumber().should.equal(100);
    
    await testToken1.transfer(pairAddress, 200, {from: accounts[1]});
    await testToken2.transfer(pairAddress, 200, {from: accounts[1]});
    balanceToken1Pair = await testToken1.balanceOf(pairAddress);
    balanceToken2Pair = await testToken2.balanceOf(pairAddress);
    balanceToken1Pair.toNumber().should.equal(400);
    balanceToken2Pair.toNumber().should.equal(400);
    await this.pair.mint(accounts[1]);
    const liquidityTokensAccount1 = await this.pair.balanceOf.call(accounts[1]);
    liquidityTokensAccount1.toNumber().should.equal(200);
  })

  it("verify mint event", async () => {
    const pairAddress = await this.pair.address;
    await testToken1.transfer(pairAddress, 100, {from: accounts[0]});
    await testToken2.transfer(pairAddress, 400, {from: accounts[0]});
    let tx = await this.pair.mint(accounts[0]);
    truffleAssert.eventEmitted(tx, "Mint", (ev) => {
      return ((ev[1].toNumber() == 100) && (ev[2].toNumber() == 400) && (ev[3] == accounts[0]) && (ev[0] == accounts[0]));
    });
  })

  it("Verify malicious call to mint, when pair has no liquidity", async () => {
    await truffleAssert.reverts(this.pair.mint(accounts[0]), "Swappy: Subtraction Underflow");
  })

  it("Verify malicious call to mint, when pair has initial liquidity", async () => {
    const pairAddress = await this.pair.address;
    await testToken1.transfer(pairAddress, 200, {from: accounts[0]});
    await testToken2.transfer(pairAddress, 200, {from: accounts[0]});
    await this.pair.mint(accounts[0]);

    await truffleAssert.reverts(this.pair.mint(accounts[0]), "Swappy: Insufficient liquidity minted");
  })

  it("verify draw tokens function", async () => {
    const pairAddress = await this.pair.address;
    await testToken1.transfer(pairAddress, 200, {from: accounts[0]});
    await testToken2.transfer(pairAddress, 200, {from: accounts[0]});
    await this.pair.mint(accounts[0]);
    
    await testToken1.transfer(pairAddress, 10, {from: accounts[1]});

    await truffleAssert.reverts(this.pair.drawTokens(0, 10, accounts[1], {from: accounts[1]}), "Swappy: Invarient");

    await this.pair.drawTokens(0, 9, accounts[1], {from: accounts[1]});

    const balanceToken1Account1 = await testToken1.balanceOf(accounts[1]);
    const balanceToken2Account1 = await testToken2.balanceOf(accounts[1]);
    balanceToken1Account1.toNumber().should.equal(990);
    balanceToken2Account1.toNumber().should.equal(1009);
  })

  it("verify draw token event", async () => {
    const pairAddress = await this.pair.address;
    await testToken1.transfer(pairAddress, 100, {from: accounts[0]});
    await testToken2.transfer(pairAddress, 400, {from: accounts[0]});
    await this.pair.mint(accounts[0]);
    await testToken1.transfer(pairAddress, 10, {from: accounts[1]});
    let tx = await this.pair.drawTokens(0, 9, accounts[1], {from: accounts[1]});

    truffleAssert.eventEmitted(tx, "DrawTokens", (ev) => {
      return ((ev[0] == accounts[1]) && (ev[1].toNumber() == 10) && (ev[2].toNumber() == 0)
        && (ev[3] == 0) && ev[4] == 9 && ev[5] == accounts[1]);
    });
  })

  it("verify malicious call to draw tokens", async () => {
    await truffleAssert.reverts(this.pair.drawTokens(10, 10, accounts[1], {from: accounts[1]}), "Swappy: Amount taken out should be less than reserves");
  })

  it("verify burn tokens function", async () => {
    const pairAddress = await this.pair.address;
    await testToken1.transfer(pairAddress, 200, {from: accounts[0]});
    await testToken2.transfer(pairAddress, 200, {from: accounts[0]});
    await this.pair.mint(accounts[0]);
    
    await this.pair.transfer(pairAddress, 100, {from: accounts[0]});
    await this.pair.burn(accounts[0]);


    const balanceToken1Account0 = await testToken1.balanceOf(accounts[0]);
    const balanceToken2Account0 = await testToken2.balanceOf(accounts[0]);
    balanceToken1Account0.toNumber().should.equal(900);
    balanceToken2Account0.toNumber().should.equal(900);
  })

  it("verify burn event", async () => {
    const pairAddress = await this.pair.address;
    await testToken1.transfer(pairAddress, 100, {from: accounts[0]});
    await testToken2.transfer(pairAddress, 400, {from: accounts[0]});
    await this.pair.mint(accounts[0]);

    await this.pair.transfer(pairAddress, 100, {from: accounts[0]});
    let tx = await this.pair.burn(accounts[0]);
    truffleAssert.eventEmitted(tx, "Burn", (ev) => {
      return ((ev[1].toNumber() == 50) && (ev[2].toNumber() == 200) && (ev[3] == accounts[0]) && (ev[0] == accounts[0]));
    });
  })

  it("Verify malicious call to burn", async () => {
    await truffleAssert.reverts(this.pair.burn(accounts[0]), "Swappy: No liquidity to burn");
  })

});
