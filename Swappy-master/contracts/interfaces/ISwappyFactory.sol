pragma solidity ^0.6.2;


/**
 *@title Interface for factory contract
 */
interface ISwappyFactory {
    event pairCreated(
        address indexed token1,
        address indexed token2,
        address pairAddress
    );

    /**
     *@notice feeTo getter function
     */
    function feeTo() external view returns (address);

    /**
     *@notice function to create pair
     */
    function createPair(address token1, address token2)
        external
        returns (address pairAddress);

    /**
     *@notice Total number of pairs generated by factory
     */
    function pairsNumber() external view returns (uint256 size);

    /**
     *@notice Function to return pair
     */
    function getPair(address token1, address token2)
        external
        view
        returns (address pairAddress);

    /**
     *@notice Get pair stored in given index
     */
    function getAllPairs(uint256 index)
        external
        view
        returns (address pairAddress);
}
