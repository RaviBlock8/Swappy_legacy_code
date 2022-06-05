pragma solidity ^0.6.2;


/**
 *@title Interface for Router contract
 *@dev Router contract is reponsible for making safe interactions with other core contracts
 */
interface ISwappyRouter {
    /**
     *@notice Returns factory contract address
     */
    function factory() external view returns (address);

    /**
     *@title removeLiquidity
     *@dev to return the ratio in which both tokens will be removed
     */
    function removeLiquidity(
        address token1,
        address token2,
        uint256 liquidity,
        uint256 amount1Min,
        uint256 amount2Min,
        address to,
        uint256 deadline
    ) external returns (uint256 amount1, uint256 amount2);

    /**
     *@notice this function will be the one through which liquidity Providers will interact
     */
    function addLiquidty(
        address token1,
        address token2,
        uint256 amount1Max,
        uint256 amount2Max,
        uint256 amount1Min,
        uint256 amount2Min,
        address to,
        uint256 deadline
    )
        external
        returns (
            uint256 amount1,
            uint256 amount2,
            uint256 liquidity
        );

    /**
     *@notice The function swaps a given quantity(amountIn) of tokenIn tokens for any amount of tokenOut tokens
     * such that their amount is greater than equal to amountOutMax
     */
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address tokenIn,
        address tokenOut,
        address to,
        uint256 deadline
    ) external returns (uint256 amount);

    /**
     *@notice The function swaps any amount of input tokens for a fixed amount of output tokens such that
     * the amount to be sent is less that amountInMax
     */
    function swapTokensForExactTokens(
        uint256 amountInMax,
        uint256 amountOut,
        address tokenIn,
        address tokenOut,
        address to,
        uint256 deadline
    ) external returns (uint256 amount);

    /**
 @notice To get the value of reserves of a token pair
 */
    function getReserves(address token1, address token2)
        external
        view
        returns (uint256 reserve1, uint256 reserve2);
}
