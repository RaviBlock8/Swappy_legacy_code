pragma solidity ^0.6.2;

import './libraries/SafeMath.sol';
import './interfaces/IERC20.sol';

contract TestERC20 {
    using SafeMath for uint256;
    ///@notice Name and symbol of ERC20 token
    string public constant name = "ERC20Basic";
    string public constant symbol = "BSC";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    /// Event will be emitted when approve wiill be triggred
    event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
    /// Event will be emitted when transfer of token will be triggered
    event Transfer(address indexed from, address indexed to, uint tokens);

    /**
    *@title constructor to get chain id
    *@dev It retrieves the chainId
    */
    constructor() public{
        // uint chainId;
        // assembly{
        //     chainId:=chainid()
        // }
        // DOMAIN_SEPARATOR = keccak256(
        //     abi.encode(
        //         keccak256('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'),
        //         keccak256(bytes(name)),
        //         keccak256(bytes('1')),
        //         chainId,
        //         address(this)
        //     )
        // );
    }

    /// Mapping of balance for each unique address
    mapping(address => uint256) public balanceOf;
    /// Mapping to store allowance for each unique address
    mapping(address => mapping (address => uint256)) public allowance;

    /**
    *@title function to mint tokens
    *@dev It mints the tokens
    *@param to address of receiver
    *@param value number of tokens to be minted
    */
    function _mint(address to, uint value) internal {
        /// total supply after minting of tokens
        totalSupply = totalSupply.add(value);
        /// balance of reciever after tokens are minted
        balanceOf[to] = balanceOf[to].add(value);
        emit Transfer(address(0), to, value);
    }

    function mint(address to, uint value) external {
        _mint(to, value);
    }

    function _burn(address from, uint value) internal {
        /// balance of address after tokens are burned
        balanceOf[from] = balanceOf[from].sub(value);
        /// totalsupply after tokens are burned
        totalSupply = totalSupply.sub(value);
        emit Transfer(from, address(0), value);
    }

    function burn(address from, uint value) external {
        _burn(from, value);
    }

    function transfer(address receiver, uint numTokens) public returns (bool) {
        /// checks whether owner has sufficient balance
        require(numTokens <= balanceOf[msg.sender], "Swappy: Insufficient Balance");
        /// balance of owner after transfer of tokens
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(numTokens);
        /// balance of receiver after receiving tokens
        balanceOf[receiver] = balanceOf[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    function approve(address delegate, uint numTokens) public returns (bool) {
        /// owner assigning number of tokens to a delegate
        allowance[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    function transferFrom(address owner, address buyer, uint numTokens) public returns (bool) {
        /// Checks for minimum balance
        require(numTokens <= balanceOf[owner], "Swappy: Insufficient Balance");
        /// Is a sender allowed to send sufficient amount of tokens
        require(numTokens <= allowance[owner][msg.sender], "Swappy: Insufficient Allowance");
        /// balance of owner after transfer of tokens
        balanceOf[owner] = balanceOf[owner].sub(numTokens);
        /// balance of delegate after transfer of tokens
        allowance[owner][msg.sender] = allowance[owner][msg.sender].sub(numTokens);
        /// balance of buyer after transfer of token
        balanceOf[buyer] = balanceOf[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }
}