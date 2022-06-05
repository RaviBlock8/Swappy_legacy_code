pragma solidity ^0.6.2;

/**
*@title Interface for any pair in Swappy Exchange
*/
interface ISwappyPair {
    /**
     *@notice Get the reserve of token1, held by the contract
     */
    function reserve1() external view returns (uint112);

    /**
     *@notice Get the reserve of token2, held by the contract
     */
    function reserve2() external view returns (uint112);

    /**
     *@notice Initialize token pair for the contract
     */
    function initialize(address token1, address token2) external;

    /**
     *@notice Draw tokens from the contract, without unsatisfying invarient property
     */
    function drawTokens(uint token1Amount, uint token2Amount, address to) external;

    /**
     *@notice Mint liquidity tokens of contract
     */
    function mint(address to) external returns(uint);

    /**
     *@notice Burn liquidity tokens of the contact
     */
    function burn(address to) external returns(uint, uint);

    // /**
    // *@title Function to give permit
    // */
    // function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;

    // /**
    // *@title Function to transfer tokens from one address to another
    // */
    // function transferFrom(address from, address to, uint value) external returns (bool);
}