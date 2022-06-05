pragma solidity ^0.6.2;

/**
 *@title Interface for ERC20 contract
 */
interface IERC20 {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    /**
    *@title Function to get name of contract
    */
    function name() external view returns (string memory);

    /**
    *@title Function to get symbol of contract
    */
    function symbol() external view returns (string memory);

    /**
    *@title Function to get no. of decimals of contract
    */
    function decimals() external view returns (uint8);

    /**
    *@title Function to return total supply of contract
    */
    function totalSupply() external view returns (uint);

    /**
    *@title Function to return balance of token owner
    */
    function balanceOf(address owner) external view returns (uint);

    /**
    *@title Function to return allowance a particular owner has assigned to a spender
    */
    function allowance(address owner, address spender) external view returns (uint);

    /**
    *@title Function to assign a approver some token amount.
    */
    function approve(address spender, uint value) external returns (bool);

    /**
    *@title Function to transfer token to a address
    */
    function transfer(address to, uint value) external returns (bool);

    /**
    *@title Function to transfer tokens from one address to another
    */
    function transferFrom(address from, address to, uint value) external returns (bool);

    function DOMAIN_SEPARATOR() external view returns (bytes32);
    function PERMIT_TYPEHASH() external pure returns (bytes32);

    /**
    *@title Function to return nonce value
    */
    function nonces(address owner) external view returns (uint);

     /**
    *@title Function to give permit
    */
    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;
}
