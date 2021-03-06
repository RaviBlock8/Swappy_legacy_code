pragma solidity ^0.6.2;

import "./interfaces/ISwappyFactory.sol";
import "./SwappyPair.sol";


/**
*@title Factory contract of swappy
*@dev It inherits ISwappyFactory interface 
*/
contract SwappyFactory is ISwappyFactory{
    /// Mapping to store pair address for each unique token pair 
    mapping(address=>mapping(address=>address)) internal tokenPair;
    /// Array to store all existing pairs independent of which token they belong too
    address[] public allPairs;
    ///person to whom fees will go to
    address public override feeTo;
    ///person who can se feeTo variable
    address public feeToSetter;
    ///@dev Event will be emitted when pair created
    event PairCreated(
        address indexed token1,
        address indexed token2,
        address pairAddress,
        address precalculatedAddress
    );
    ///@dev this modifier is to check it is the feeToSetter person calling function
    modifier isFeeToSetter{
        require(msg.sender == feeToSetter,"Swappy: you are forbidded from calling this function");
        _;
    }

    /**
    *@notice constructor
    *@dev here feeToSetter is set
    */
    constructor() public{
        feeToSetter = msg.sender;
    }

    /**
    *@notice function to create pair
    *@dev It uses salt method to create new pair to make sure addresses generated are not unpredictable
    */
    function createPair(address token1,address token2) external override returns(address pairAddress) {
        ///validation to check both are not same type of token
        require(token1 != token2,"Swappy: TOKEN1_TOKEN2_IDENTICAL_ADDRESSES");
        ///validation to sure token 1 us not equivalent to 0
        require(token1 != address(0),"Swappy: TOKEN1_0_ADDRESS");
        //validation to make sure token 2 is not equivalent to 0
        require(token2 != address(0),"Swappy: TOKEN2_0_ADDRESS");
        ///validation to make sure pair doesn't already exist for given token pair
        require(tokenPair[token1][token2] == address(0),"Swappy: PAIR_ALREADY_EXISTS");
        ///@dev Getting the byte code of dummy contract to calculate address
        bytes memory bytecode = type(SwappyPair).creationCode;
        ///@dev getting sorted pair of tokens togenerate salt and initialize pair
        (address tokenA,address tokenB) = token1<token2 ? (token1,token2):(token2,token1);
        ///@dev Using two tokens to generate salt to be used to generate address
        bytes32 salt = keccak256(abi.encodePacked(tokenA,tokenB));

        /**
        *@notice To calculate address new pair will be assigned
        *@dev It used Bytecode of creating contract,bytecode of created contract,arguments and salt
        */
        pairAddress = address(uint(keccak256(abi.encodePacked(
            byte(0xff),
            address(this),
            salt,
            keccak256(abi.encodePacked(
                bytecode
            ))
        ))));
        ///here we are creating new Pair contract and passing salt to generarte address using it 
        SwappyPair pair = new SwappyPair{salt:salt}();
        /**
        *@dev These token addresses were not passed as an arg in constructor of
        *Pair contract because then we would have to use them while calculating address
        *and using address data type , was bringing in correct results while calculating 
        *address before hand , however it was working fine for other data types.
        *@notice Initializing pair with token pairs
        */
        pair.initialize(tokenA,tokenB);
        tokenPair[token1][token2] = pairAddress;
        tokenPair[token2][token1] = pairAddress;
        allPairs.push(pairAddress);
        ///event emitted that pair is created
        emit PairCreated(token1,token2,address(pair),pairAddress);
    }
    
    /**
    *@notice Function to return pair
    *@param token1_address 
    *@param token2_address
    */
    function getPair(address token1, address token2) external override view returns (address pairAddress){
        ///@dev same validations as used in createPair 
        require(token1 != token2,"Swappy: TOKEN1_TOKEN2_IDENTICAL_ADDRESSES");
        require(token1 != address(0),"Swappy: TOKEN1_0_ADDRESS");
        require(token2 != address(0),"Swappy: TOKEN2_0_ADDRESS");
        pairAddress = tokenPair[token1][token2];
    }

    /**
    *@notice Get pair stored in given index
    *@param index
    *@dev this  function will be used in front end to get all the pairs or in other contract
    */
    function getAllPairs(uint256 index) external override view returns (address pairAddress){
        pairAddress = allPairs[index];
    }

    /**
    *@notice Total number of pairs generated by factory
    */
    function pairsNumber() public override view returns (uint256 size){
        size = allPairs.length;
    }

    /**
    *@notice Sets address to whom fees will go to
    */
    function setFeeTo(address _feeTo) public isFeeToSetter{
        feeTo = _feeTo;
    }

    /**
    *@title Sets feeToSetter
    */
    function setFeeToSetter(address _feeToSetter) public isFeeToSetter{
        feeToSetter = _feeToSetter;
    }
}
