pragma solidity ^0.6.2;

import "./interfaces/ISwappyFactory.sol";
import "./interfaces/ISwappyPair.sol";
import "./libraries/SwappyLibrary.sol";
import "./interfaces/ISwappyRouter.sol";

contract SwappyRouter is ISwappyRouter {
    address public override factory;

    constructor(address _factory) public {
        factory = _factory;
    }
    ///@dev this is to check how much is the time limit for transaction to be part of block
    modifier notExpired(uint256 deadline){
        require(deadline>=block.timestamp,"Swappy: Expired");
        _;
    }

    /**
     *@notice _addLiquidity
     *@dev to return the ratio in which both tokens will be added
     */
    function _addLiquidity(
        address token1,
        address token2,
        uint256 amount1Max,
        uint256 amount2Max,
        uint256 amount1Min,
        uint256 amount2Min
    ) private returns (uint256 amount1, uint256 amount2) {
        ///@dev here we are checking if pair doesn't exist then create one
        if (ISwappyFactory(factory).getPair(token1, token2) == address(0)) {
            ISwappyFactory(factory).createPair(token1, token2);
        }
        ///@dev here we are getting the value of reserves of token1 and token 2 in alloted pair
        (uint256 reserve1, uint256 reserve2) = SwappyLibrary.getReserves(
            factory,
            token1,
            token2
        );
        /**@dev if both reserves are empty then it must be investor entering liquidity hence
           there is no point of maintaning ratio as reserves are empty already*/
        if (reserve1 == 0 && reserve2 == 0) {
            (amount1, amount2) = (amount1Max, amount2Max);
        } else {
            /**
             *@dev here if reserves are not empty we are caculating how much of token2 needed to be
             *added in ratio to token1Max to maintain the price of reserve
             */
            uint256 amount2Optimal = SwappyLibrary.getQuote(
                amount1Max,
                reserve1,
                reserve2
            );
            /**
             *@dev Incase the value of token1 in pair is high then chances are amount of token2 that
             *needed to be added in ratio to amount1Max will exceed the max amount of token2 that
             *are alloted to be get used by this contract(amount2Max), in that scenario it will
             *get false or we can say if token2 amount is depreciated too much.
             */
            if (amount2Optimal <= amount2Max) {
                /**
                 *@dev now we know that token2 amount is not depreciated too much, so here we are
                 * checking if token 2 maount is appreciated too much.
                 */
                require(
                    amount2Optimal >= amount2Min,
                    "Swappy: Ratio of token 2 amount is lesser then minimum limit"
                );
                (amount1, amount2) = (amount1Max, amount2Optimal);
            } else {
                /**
                 *@dev since now we know that token2 amount in ratio is way more high than the one alloted
                 * to contract to spent, here we are checking how much token 1 we will have to give if token2
                 * amount set to max limit this contract is allowed to spend.
                 */
                uint256 amount1Optimal = SwappyLibrary.getQuote(
                    amount2Max,
                    reserve2,
                    reserve1
                );
                assert(amount1Optimal <= amount1Max);
                require(
                    amount1Optimal >= amount1Min,
                    "Swappy: Ratio of token1 amount is lesser than minimum limit"
                );
                (amount1, amount2) = (amount1Optimal, amount2Max);
            }
        }
    }

    /// **REMOVE LIQUIDITY**

    /**
     *@notice removeLiquidity
     *@dev to return the ratio in which both tokens will be removed
     */
    function removeLiquidity(
        address token1,
        address token2,
        uint liquidity,
        uint amount1Min,
        uint amount2Min,
        address to,
        uint deadline
    ) external override notExpired(deadline) returns(uint amount1, uint amount2){
        ///@dev here we are creating a pair address for a token
        address pair = ISwappyFactory(factory).getPair(token1, token2);

        ///@dev here liquidity is send to pair
        safeTransferFrom(pair, msg.sender, pair, liquidity);
        ///@dev returns the tokens after burning tokens for pair
        (uint amountA, uint amountB) = ISwappyPair(pair).burn(to);
        /// assigns the minimum amount token to tokenA
        (address tokenA,) = SwappyLibrary.sortTokens(token1,token2);
        (amount1, amount2) = token1 == tokenA ? (amountA, amountB):(amountB, amountA);
        /// to check the amount of token1 is not sufficient
        require((amount1 >= amount1Min),"Swappy: AMOUNT_1_NOT_SUFFICIENT");
        /// to check the amount of token2 is not sufficient
        require((amount2 >= amount2Min),"Swappy: AMOUNT_2_NOT_SUFFICIENT");
    }

    /// **REMOVE LIQUIDITY WITH PERMIT**

    // function removeLiquidityWithPermit(
    //     address token1,
    //     address token2,
    //     uint liquidity,
    //     uint amount1Min,
    //     uint amount2Min,
    //     address to,
    //     uint deadline,
    //     bool approveMax, uint8 v, bytes32 r, bytes32 s
    // ) external returns(uint amount1, uint amount2){
    //     address pair = SwappyLibrary.pairFor(factory,token1, token2);
    //     uint value = approveMax ? uint(-1):liquidity;
    //     ISwappyPair(pair).permit(msg.sender, address(this), value, deadline, v, r, s);
    //     (amount1, amount2) = this.removeLiquidity(token1, token2,liquidity, amount1Min, amount2Min, to, deadline);
    // }
    /**
     *@notice addliquidity in reserve
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
    external override notExpired(deadline) returns(uint256 amount1,uint256 amount2,uint256 liquidity){
        ///here, I am calling private _addLiquidity to get ratio in which tokens need to be added
        (amount1,amount2) = _addLiquidity(token1,token2,amount1Max,amount2Max,amount1Min,amount2Min);
        ///Getting address of pair for these two tokens
        address pair = ISwappyFactory(factory).getPair(token1,token2);
        ///Transfering tokens to pair contract
        safeTransferFrom(token1,msg.sender,pair,amount1);
        safeTransferFrom(token2,msg.sender,pair,amount2);
        ///calling burn function to burn tokens and transfer liquidity back to owner
        liquidity = ISwappyPair(pair).mint(to);
    }

    /**
     *@notice The function swaps a given quantity(amountIn) of tokenIn tokens for any amount of tokenOut tokens
     * such that their amount is greater than equal to amountOutMax
    */
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address tokenIn,
        address tokenOut,
        address to,
        uint deadline
    ) external override notExpired(deadline) returns (uint amount) {
        /// Get reserves of Input and Output tokens in the pair.
        (uint reserveIn, uint reserveOut) = SwappyLibrary.getReserves(factory, tokenIn, tokenOut);
        /// Get the address of with smaller address.
        (address token1, ) = SwappyLibrary.sortTokens(tokenIn, tokenOut);
        /// The maximum amount of output tokens that can be exchanged without unsatisfying the invarient property.
        amount = SwappyLibrary.getAmountOut(amountIn, reserveIn, reserveOut);
        /// Require the amount to be greater than amountOutMin
        require(amount >= amountOutMin, "Swappy: Insufficient output amount");
        /// Transfer input tokens to the contract
        safeTransferFrom(tokenIn, msg.sender, SwappyLibrary.getPair(factory, tokenIn, tokenOut), amountIn);
        /// Check which token is the input token
        if(tokenIn == token1) {
            /// Draw equivalent amount of token2
            ISwappyPair(SwappyLibrary.getPair(factory, tokenIn, tokenOut)).drawTokens(0, amount, to);
        } else {
            /// Draw equivalent amount of token1
            ISwappyPair(SwappyLibrary.getPair(factory, tokenIn, tokenOut)).drawTokens(amount, 0, to);
        }
    }

    /**
     *@notice The function swaps any amount of input tokens for a fixed amount of output tokens such that
     * the amount to be sent is less that amountInMax
    */
    function swapTokensForExactTokens(
        uint amountInMax,
        uint amountOut,
        address tokenIn,
        address tokenOut,
        address to,
        uint deadline
    ) external override notExpired(deadline) returns (uint amount) {
        /// Get reserves of Input and Output tokens in the pair.
        (uint reserveIn, uint reserveOut) = SwappyLibrary.getReserves(factory, tokenIn, tokenOut);
        /// Get the address of with smaller address.
        (address token1, ) = SwappyLibrary.sortTokens(tokenIn, tokenOut);
        /// The minimum amount of input tokens that can be exchanged without unsatisfying the invarient property.
        amount = SwappyLibrary.getAmountIn(amountOut, reserveIn, reserveOut);
        /// Require the amount to be lesser than amountInMax
        require(amount <= amountInMax, "Swappy: Insufficient input amount");
        /// Transfer input tokens to the contract
        safeTransferFrom(tokenIn, msg.sender, SwappyLibrary.getPair(factory, tokenIn, tokenOut), amount);
        /// Check which token is the Output token
        if(tokenOut == token1) {
            /// Draw equivalent amount of token1
            ISwappyPair(SwappyLibrary.getPair(factory, tokenIn, tokenOut)).drawTokens(amountOut, 0, to);
        } else {
            /// Draw equivalent amount of token2
            ISwappyPair(SwappyLibrary.getPair(factory, tokenIn, tokenOut)).drawTokens(0, amountOut, to);
        }
    }

    /**
     *@title To transfer tokens from one address to another using low level call
    */
    function safeTransferFrom(address token, address from, address to, uint256 value) internal {
        // bytes4(keccak256(bytes('transferFrom(address,address,uint256)')));
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x23b872dd, from, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'Transfer: TRANSFER_FROM_FAILED');
    }

    /**
     @notice To get the value of reserves of a token pair
     */
    function getReserves(address token1, address token2) override external view returns(uint reserve1, uint reserve2) {
        address pairAddress = ISwappyFactory(factory).getPair(token1, token2);
        require(pairAddress != address(0), "Swappy: Pair Does not exists");
        (reserve1, reserve2) = SwappyLibrary.getReserves(factory, token1, token2);
    }
}
