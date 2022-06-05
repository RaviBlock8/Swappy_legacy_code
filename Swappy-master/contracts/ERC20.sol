pragma solidity ^0.6.2;

import "./libraries/SafeMath.sol";
import "./interfaces/IERC20.sol";


/**
 *@title ERC20 token contract of swappy
 *@dev It inherits IERC20 interface
 */
contract ERC20Basic is IERC20 {
    using SafeMath for uint256;
    ///@notice Name and symbol of ERC20 token
   string public constant override name = "ERC20Basic";
    string public constant override symbol = "BSC";
    uint8 public constant override decimals = 18;
    uint256 public override totalSupply;

    bytes32 public override DOMAIN_SEPARATOR;
    bytes32 public override constant PERMIT_TYPEHASH = 0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9;
    /// Mapping to store nonce
    mapping(address => uint256) public override nonces;

    /// Event will be emitted when approve wiill be triggred
    event Approval(
        address indexed tokenOwner,
        address indexed spender,
        uint256 tokens
    );
    /// Event will be emitted when transfer of token will be triggered
    event Transfer(address indexed from, address indexed to, uint256 tokens);

    /**
     *@notice constructor to get chain id
     *@dev It retrieves the chainId
     */
    constructor() public {
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
    mapping(address => uint256) public override balanceOf;
    /// Mapping to store allowance for each unique address
    mapping(address => mapping(address => uint256)) public override allowance;

    /**
     *@notice function to mint tokens
     *@dev It mints the tokens
     *@param to address of receiver
     *@param value number of tokens to be minted
     */
    function _mint(address to, uint256 value) internal {
        /// total supply after minting of tokens
        totalSupply = totalSupply.add(value);
        /// balance of reciever after tokens are minted
        balanceOf[to] = balanceOf[to].add(value);
        emit Transfer(address(0), to, value);
    }

    /**
     *@notice function to burn tokens
     *@dev It burns the tokens
     *@param from address from where token would be burned
     *@param value no. of tokens to be burned
     */
    function _burn(address from, uint256 value) internal {
        /// balance of address after tokens are burned
        balanceOf[from] = balanceOf[from].sub(value);
        /// totalsupply after tokens are burned
        totalSupply = totalSupply.sub(value);
        emit Transfer(from, address(0), value);
    }

    /**
     *@notice function to transfer tokens
     *@dev It used receiver address to transfer tokens too
     *@param receiver address of receiver to whome tokens are transferred
     *@param numTokens number to tokens to be transferred
     */
    function transfer(address receiver, uint256 numTokens)
        public
        override
        returns (bool)
    {
        /// checks whether owner has sufficient balance
        require(
            numTokens <= balanceOf[msg.sender],
            "Swappy: Insufficient Balance"
        );
        /// balance of owner after transfer of tokens
        balanceOf[msg.sender] = balanceOf[msg.sender].sub(numTokens);
        /// balance of receiver after receiving tokens
        balanceOf[receiver] = balanceOf[receiver].add(numTokens);
        emit Transfer(msg.sender, receiver, numTokens);
        return true;
    }

    /**
     *@notice function to approve a delegate
     *@dev It approves a delegate who can make transactions on the behalf of owner
     *@param delegate address to be assigned as delegate
     *@param numTokens number of tokens to be assigned to a delgate
     */
    function approve(address delegate, uint256 numTokens)
        public
        override
        returns (bool)
    {
        /// owner assigning number of tokens to a delegate
        allowance[msg.sender][delegate] = numTokens;
        emit Approval(msg.sender, delegate, numTokens);
        return true;
    }

    /**
     *@notice function to transfer tokens from one account to another
     *@dev It transfers tokens from
     *@param owner address of owner
     *@param buyer address of buyer
     *@param numTokens no. of token transferred from owner to buyer
     */
    function transferFrom(
        address owner,
        address buyer,
        uint256 numTokens
    ) public override returns (bool) {
        /// Checks for minimum balance
        require(numTokens <= balanceOf[owner], "Swappy: Insufficient Balance");
        /// Is a sender allowed to send sufficient amount of tokens
        require(
            numTokens <= allowance[owner][msg.sender],
            "Swappy: Insufficient Allowance"
        );
        /// balance of owner after transfer of tokens
        balanceOf[owner] = balanceOf[owner].sub(numTokens);
        /// balance of delegate after transfer of tokens
        allowance[owner][msg.sender] = allowance[owner][msg.sender].sub(
            numTokens
        );
        /// balance of buyer after transfer of token
        balanceOf[buyer] = balanceOf[buyer].add(numTokens);
        emit Transfer(owner, buyer, numTokens);
        return true;
    }

    /**
    *@notice function to give permit
    *@dev this function makes sure users can authorize a transfer of 
    their pool shares with a signature, rather than an on-chain transaction from their address. 
    */
    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external override {
        /// checking deadline
        require(deadline >= block.timestamp, "ERC20Basic:EXPIRED");
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(
                    abi.encode(
                        PERMIT_TYPEHASH,
                        owner,
                        spender,
                        value,
                        nonces[owner]++,
                        deadline
                    )
                )
            )
        );
        /// ecerecovers the address from bytecode generated
        address recoveredAddress = ecrecover(digest, v, r, s);
        require(
            recoveredAddress != address(0) && recoveredAddress == owner,
            "Swappy:INVALID_SIGNATURE"
        );
    }
}
