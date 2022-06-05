pragma solidity ^0.6.2;

import "./SafeMath.sol";
import "../interfaces/ISwappyPair.sol";
import "../interfaces/ISwappyFactory.sol";


library SwappyLibrary {
    using SafeMath for uint256;

    /**
     *@title to get reserves value of both the tokens
     */
    function getReserves(address factory, address token1, address token2)
        internal
        view
        returns (uint256 reserve1, uint256 reserve2)
    {
        ///here we are just getting the pair address for given tokens
        address pairAddress = ISwappyFactory(factory).getPair(token1, token2);
        ///getting value of reserve for token1
        uint256 reserveA = ISwappyPair(pairAddress).reserve1();
        ///getting reserve value of token2
        uint256 reserveB = ISwappyPair(pairAddress).reserve2();
        (reserve1,reserve2) = token2<token1 ? (reserveB,reserveA) : (reserveA,reserveB);
    }

    /**
     *@title to get quote on how much token B for token A
     */
    function getQuote(uint256 amountA, uint256 reserveA, uint256 reserveB)
        internal
        pure
        returns (uint256 amountB)
    {
        require(
            amountA > 0,
            "Swappy: token1 supplied amount should be greater than 0"
        );
        require(
            reserveA > 0 && reserveB > 0,
            "Swappy: value of both reserve must be greater than 0"
        );
        amountB = amountA.mul(reserveB) / reserveA;
    }

    function getPair(address factory, address token1, address token2) internal view returns(address) {
        return ISwappyFactory(factory).getPair(token1, token2);
    }

    /**
     *@notice given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
     */
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) internal pure returns (uint amountOut) {
        require(amountIn > 0, 'SwappyLibrary: INSUFFICIENT_INPUT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'SwappyLibrary: INSUFFICIENT_LIQUIDITY');
        uint amountInWithFee = amountIn.mul(997);
        uint numerator = amountInWithFee.mul(reserveOut);
        uint denominator = reserveIn.mul(1000).add(amountInWithFee);
        amountOut = numerator / denominator;
    }

    /**
     *@notice given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
     */
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) internal pure returns (uint amountIn) {
        require(amountOut > 0, 'SwappyLibrary: INSUFFICIENT_OUTPUT_AMOUNT');
        require(reserveIn > 0 && reserveOut > 0, 'SwappyLibrary: INSUFFICIENT_LIQUIDITY');
        uint numerator = reserveIn.mul(amountOut).mul(1000);
        uint denominator = reserveOut.sub(amountOut).mul(997);
        amountIn = (numerator / denominator).add(1);
    }

    /**
     *@title used to returns sorted token addresses
     */
    function sortTokens(address tokenA, address tokenB) public pure returns(address token1, address token2){
        /// to check that tokens are not identical
        require(tokenA!=tokenB,"Swappy: SAME_ADDRESS");
        ///sort tokens
        (token1,token2) = tokenA<tokenB ? (tokenA,tokenB):(tokenB,tokenA);
        /// to check that token1 is not a zero address
        require(token1!=address(0),"Swappy: ZERO_ADDRESS");
    }

    /**
     *@title used to calculate adrress of a pair
     */
    function pairFor(address factory, address tokenA, address tokenB) public pure returns(address pair){
        /// sort tokens
        (address token1, address token2) = sortTokens(tokenA, tokenB);
        pair = address(uint(keccak256((abi.encodePacked(
            hex'ff',
            factory,
            keccak256(abi.encodePacked(token1, token2)),
            hex'96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'
        )))));
    }
}
