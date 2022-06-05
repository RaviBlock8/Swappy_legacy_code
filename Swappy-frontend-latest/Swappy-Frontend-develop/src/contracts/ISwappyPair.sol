pragma solidity ^0.6.2;


interface ISwappyPair {
    event Mint(
        address indexed sender,
        uint256 token1Amount,
        uint256 token2Amount,
        address indexed to
    );
    event Burn(
        address indexed sender,
        uint256 token1Amount,
        uint256 token2Amount,
        address indexed to
    );
    event DrawTokens(
        address indexed sender,
        uint256 token1AmountIn,
        uint256 token2AmountIn,
        uint256 token1AmountOut,
        uint256 token2AmountOut,
        address indexed to
    );

    /**
     *@title Get the reserve of token1, held by the contract
     */
    function reserve1() external view returns (uint112);

    /**
     *@title Get the reserve of token2, held by the contract
     */
    function reserve2() external view returns (uint112);

    /**
     *@title Initialize token pair for the contract
     */
    function initialize(address token1, address token2) external;

    /**
     *@title Draw tokens from the contract, without unsatisfying invarient property
     */
    function drawTokens(
        uint256 token1Amount,
        uint256 token2Amount,
        address to
    ) external;

    /**
     *@title Mint liquidity tokens of contract
     */
    function mint(address to) external returns (uint256);

    /**
     *@title Burn liquidity tokens of the contact
     */
    function burn(address to) external returns (uint256, uint256);

    // /**
    // *@title Function to give permit
    // */
    // function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;

    // /**
    // *@title Function to transfer tokens from one address to another
    // */
    // function transferFrom(address from, address to, uint value) external returns (bool);
}
