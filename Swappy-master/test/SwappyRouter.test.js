const SwappyPair = artifacts.require("SwappyPair");
const SwappyFactory = artifacts.require("SwappyFactory");
const ERC20 = artifacts.require("ERC20Basic");
const TestERC20 = artifacts.require("TestERC20");
const SwappyRouter = artifacts.require("SwappyRouter")
const truffleAssert = require("truffle-assertions");
let chai = require("chai");
chai.should();

contract("Swappy Router tests", accounts => {
  let testToken1;
  let testToken2;
  beforeEach(async () => {
    testToken1 = await TestERC20.new();
    testToken2 = await TestERC20.new();
    let addressToken1 = await testToken1.address;
    let addressToken2 = await testToken2.address;
    
    await testToken1.mint(accounts[0], 1000);
    await testToken1.mint(accounts[1], 1000);
    await testToken2.mint(accounts[0], 1000);
    await testToken2.mint(accounts[1], 1000);
    this.factory = await SwappyFactory.new();
    
    const factoryAddress = await this.factory.address;
    let pairAddress = await this.factory.createPair(addressToken1, addressToken2);
    this.router = await SwappyRouter.new(factoryAddress);
    let routerAddress = await this.router.address;
    
    await testToken1.approve(routerAddress, 500, {from: accounts[0]});
    await testToken2.approve(routerAddress, 500, {from: accounts[0]});
		await this.router.addLiquidty(addressToken1, addressToken2, 100, 400, 200, 50, accounts[0], 10000000000, {from: accounts[0]});
  });
	
	it("verify Swap of fixed number of input token, token1 as Input", async () => {
    let addressToken1 = await testToken1.address;
		let addressToken2 = await testToken2.address;
    await this.router.swapExactTokensForTokens(20, 40, addressToken1, addressToken2, accounts[0], 10000000000, {from: accounts[0]});   
		let finalBalanceToken1 = await testToken1.balanceOf.call(accounts[0]);
		let finalBalanceToken2 = await testToken2.balanceOf.call(accounts[0]);
		finalBalanceToken1.toNumber().should.equal(880);
		finalBalanceToken2.toNumber().should.equal(666);
  })

  it("verify Swap of fixed number of input token, token2 as Input", async () => {
    let addressToken1 = await testToken1.address;
		let addressToken2 = await testToken2.address;
    await this.router.swapExactTokensForTokens(20, 2, addressToken2, addressToken1, accounts[0], 10000000000, {from: accounts[0]});   
		let finalBalanceToken1 = await testToken1.balanceOf.call(accounts[0]);
		let finalBalanceToken2 = await testToken2.balanceOf.call(accounts[0]);
		finalBalanceToken1.toNumber().should.equal(904);
		finalBalanceToken2.toNumber().should.equal(580);
  })

	it("verify Swap of fixed number of output token, token1 as output", async () => {
    let addressToken1 = await testToken1.address;
		let addressToken2 = await testToken2.address;
    await this.router.swapTokensForExactTokens(100, 10, addressToken2, addressToken1, accounts[0], 10000000000, {from: accounts[0]});
		let finalBalanceToken1 = await testToken1.balanceOf.call(accounts[0]);
		let finalBalanceToken2 = await testToken2.balanceOf.call(accounts[0]);
		finalBalanceToken1.toNumber().should.equal(910);
		finalBalanceToken2.toNumber().should.equal(555);
	})

	it("verify Swap of fixed number of output token, token2 as output", async () => {
    let addressToken1 = await testToken1.address;
		let addressToken2 = await testToken2.address;
    await this.router.swapTokensForExactTokens(10, 30, addressToken1, addressToken2, accounts[0], 10000000000, {from: accounts[0]});
		let finalBalanceToken1 = await testToken1.balanceOf.call(accounts[0]);
		let finalBalanceToken2 = await testToken2.balanceOf.call(accounts[0]);
		finalBalanceToken1.toNumber().should.equal(891);
		finalBalanceToken2.toNumber().should.equal(630);
  })

  it("verify add liquidity to an existing pair and see if tokens are deducted from user balance",async ()=>{
    let addressToken1 = await testToken1.address;
    let addressToken2 = await testToken2.address;
    await testToken1.approve(this.router.address, 500, {from: accounts[1]});
    await testToken2.approve(this.router.address, 500, {from: accounts[1]});
    let testToken1Before=await testToken1.balanceOf.call(accounts[1]);
    let testToken2Before=await testToken2.balanceOf.call(accounts[1]);
    let liquidityTokens = await this.router.addLiquidty(addressToken1, addressToken2, 300, 300, 10, 10, accounts[1], 10000000000, {from: accounts[1]})
    let testToken1After=await testToken1.balanceOf.call(accounts[1]);
    let testToken2After=await testToken2.balanceOf.call(accounts[1]);
    let tokens1Spent=testToken1Before.toNumber()-testToken1After.toNumber();
    let tokens2Spent=testToken2Before.toNumber()-testToken2After.toNumber();
    tokens1Spent.should.not.equal(0);
    tokens2Spent.should.not.equal(0);
  })

  it("verify it reverts if amount2Optimal is lesser than amount2Minimum value",async ()=>{
    let addressToken1 = await testToken1.address;
    let addressToken2 = await testToken2.address;
    await truffleAssert.reverts(this.router.addLiquidty(addressToken1, addressToken2, 1, 300, 10, 299, accounts[1], 10000000000, {from: accounts[1]}),
    "Swappy: Ratio of token 2 amount is lesser then minimum limit");
  })

  it("verify it reverts if amount1Optimal is lesser than amount1Minimum value",async ()=>{
    let addressToken1 = await testToken1.address;
    let addressToken2 = await testToken2.address;
    await truffleAssert.reverts(this.router.addLiquidty(addressToken1, addressToken2, 300, 1, 299, 299, accounts[1], 10000000000, {from: accounts[1]}),
    "Swappy: Ratio of token1 amount is lesser than minimum limit");
  })

  it("verify get reserves function",async ()=>{
    let addressToken1 = await testToken1.address;
    let addressToken2 = await testToken2.address;
    let reserves = await this.router.getReserves(addressToken1, addressToken2);
    reserves.reserve1.toNumber().should.equal(100);
    reserves.reserve2.toNumber().should.equal(400);

    reserves = await this.router.getReserves(addressToken2, addressToken1);
    reserves.reserve1.toNumber().should.equal(400);
    reserves.reserve2.toNumber().should.equal(100);
  })

});