var Token = artifacts.require("ERC20Basic");

contract('ERC20Basic', (accounts)=> {
    it("Should return the balance of token owner", ()=> {
        var token;
        return Token.deployed().then((instance)=>{
          token = instance;
          return token.balanceOf.call(accounts[0]);
        }).then((result)=>{
          assert.equal(result.toNumber(), 0, 'balance is wrong');
        })
      });

    
    it("Should transfer right token", ()=> {
        var token;
        return Token.deployed().then((instance)=>{
          token = instance;
          return token.transfer(accounts[1], 0);
        }).then(()=>{
          return token.balanceOf.call(accounts[0]);
        }).then((result)=>{
          assert.equal(result.toNumber(), 0, 'accounts[0] balance is wrong');
          return token.balanceOf.call(accounts[1]);
        }).then((result)=>{
          assert.equal(result.toNumber(), 0, 'accounts[1] balance is wrong');
        })
      });

    
    it("Should give accounts[1] authority to spend account[0]'s token", ()=> {
        var token;
        return Token.deployed().then((instance)=>{
         token = instance;
         return token.approve(accounts[1], 0);
        }).then(()=>{
         return token.allowance.call(accounts[0], accounts[1]);
        }).then((result)=>{
         assert.equal(result.toNumber(), 0, 'allowance is wrong');
         return token.transferFrom(accounts[0], accounts[2], 0, {from: accounts[1]});
        }).then(()=>{
         return token.balanceOf.call(accounts[0]);
        }).then((result)=>{
         assert.equal(result.toNumber(), 0, 'accounts[0] balance is wrong');
         return token.balanceOf.call(accounts[1]);
        }).then((result)=>{
         assert.equal(result.toNumber(), 0, 'accounts[1] balance is wrong');
         return token.balanceOf.call(accounts[2]);
        }).then((result)=>{
         assert.equal(result.toNumber(), 0, 'accounts[2] balance is wrong');
        })
      });

    
    it("Should show the Transfer event", ()=> {
        var token;
        return Token.deployed().then((instance)=>{
          token = instance;
          return token.transfer(accounts[1], 0);
        }).then((result)=>{
          console.log(result.logs[0].event)
        })
      });
      
      
    it("Should show the Approval event", ()=> {
        var token;
        return Token.deployed().then((instance)=>{
          token = instance;
          return token.approve(accounts[1], 0);
        }).then((result)=>{
          console.log(result.logs[0].event)
        })
      });
});

