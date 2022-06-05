pragma solidity ^0.6.2;

import "./libraries/SafeMath.sol";
import "./libraries/UQ112x112.sol";
import "./interfaces/ISwappyPair.sol";
import "./ERC20.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/ISwappyFactory.sol";

/**
*@title Pair contract representing an exchange of 2 tokens
*@dev The contract is an ERC20 token, which implements a few additional functionality described by ISwappyPair
*/
contract SwappyPair is ERC20Basic, ISwappyPair {

    using SafeMath  for uint;
    using UQ112x112 for uint224;
    /// The reserves of token1 held by the contract
    uint112 public override reserve1;
    /// The reserves of token2 held by the contract
    uint112 public override reserve2;
    /// Address of token1 contract
    address public token1;
    /// Address of token2 contract
    address public token2;
    /// Address of factory contract that creates pair contract
    address public factory;
    uint256 klast;
    /// The least amount of liquidity the contract must contain
    uint MINIMUM_LIQUIDITY = 10 ** 2;

    bytes4 private constant SELECTOR = bytes4(
        keccak256(bytes("transfer(address,uint256)"))
    );
    /// Variable to act as a semaphore for critical functions
    uint private lock = 0;

    /**
    *@notice Modifier operates the lock semaphore, to allow only 1 transaction in critical sections of contract
    */
    modifier locker() {
        require(lock == 0, "Swappy: Contract is locked");
        lock = 1;
        _;
        lock = 0;
    }

    event Mint(address indexed sender, uint token1Amount, uint token2Amount, address indexed to);
    event Burn(address indexed sender, uint token1Amount, uint token2Amount, address indexed to);
    event DrawTokens(
        address indexed sender,
        uint token1AmountIn,
        uint token2AmountIn,
        uint token1AmountOut,
        uint token2AmountOut,
        address indexed to
    );
    constructor() public {
        factory = msg.sender;
    }

    /**
    *@notice Function to safely transfer tokens to a given account from contract
    *@param token The address of the token
    *@param to The address of the reciever
    *@param value The amount of token to be sent
    */
    function _safeTransfer(address token, address to, uint value) private {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(SELECTOR, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), 'UniswapV2: TRANSFER_FAILED');
    }

    /**
    *@notice Function called by the factory contract to initialize the token pair for the contract
    *@param _token1 Address of token1
    *@param _token1 Address of token2
    */
    function initialize(address _token1, address _token2) external override {
        require(msg.sender == factory, 'Swappy: Only Factory is allowed to call this function'); // sufficient check
        token1 = _token1;
        token2 = _token2;
    }

    /**
    *@notice Update the value of reserves to the actual balance of the tokens the contract has
    */
    function _update() private {
        reserve1 = uint112(IERC20(token1).balanceOf(address(this)));
        reserve2 = uint112(IERC20(token2).balanceOf(address(this)));
    }

    function _mintFee(uint112 _reserve1, uint112 _reserve2)
        private
        returns (bool isFeeOn)
    {
        address feeTo;
        //feeTo = ISwappyFactory(factory).feeTo();
        isFeeOn = feeTo != address(0);
        uint256 _klast = klast;
        if (isFeeOn) {
            if (_klast != 0) {
                uint256 rootK = SafeMath.sqrt(uint(_reserve1).mul(_reserve2));
                uint256 rootKLast = SafeMath.sqrt(_klast);
                uint256 num = totalSupply.mul(rootK.sub(rootKLast));
                uint256 den = rootK.mul(5).add(rootKLast);
                uint256 liquidityAmount = num / den;
                if (liquidityAmount > 0) _mint(feeTo, liquidityAmount);
            }
        } else {
            if (klast != 0) {
                klast = 0;
            }
        }
    }

    /**
    *@notice Convert the extra resources provided to the contract to Pair's liquidity tokens and send them to reciever
    *@param to The address of the token reciever
    *@return The number of Pair's tokens that are minited to the provided address
    */
    function mint(address to) external locker override returns(uint liquidityTokens) {
        uint initialReserveToken1 = reserve1;
        uint initialReserveToken2 = reserve2;

        /// The current actual token1 balance, which can be more that the current reserve value
        uint actualBalanceToken1 = IERC20(token1).balanceOf(address(this));
        /// The current actual token2 balance, which can be more that the current reserve value
        uint actualBalanceToken2 = IERC20(token2).balanceOf(address(this));
        /// Difference between actual balance and reserve value for token1
        uint token1Provided = actualBalanceToken1.sub(initialReserveToken1);
        /// Difference between actual balance and reserve value for token2
        uint token2Provided = actualBalanceToken2.sub(initialReserveToken2);
        /// Check the totalSupply of the Pair's tokens
        if(totalSupply == 0) {
            /// For initial liquidity being provided MINIMUM_LIQUIDITY amount of Pair's tokens are locked forever.
            /// So that MINIMUM_LIQUIDITY can never be withdrawn from the contract
            liquidityTokens = SafeMath.sqrt(token1Provided.mul(token2Provided)).sub(MINIMUM_LIQUIDITY);
            _mint(address(0), MINIMUM_LIQUIDITY);
        } else {
            /// Calculate Pair's tokens on pro-rata basis for the amount of liquidity provided
            liquidityTokens = SafeMath.min(
                token1Provided.mul(totalSupply) / initialReserveToken1,
                token2Provided.mul(totalSupply) / initialReserveToken2
            );
        }
        require(liquidityTokens > 0, "Swappy: Insufficient liquidity minted");
        /// Mint tokens to the provided address
        _mint(to, liquidityTokens);
        _update();
        emit Mint(msg.sender, token1Provided, token2Provided, to);
    }

    /**
    *@notice Convert the extra liquidityTokens held by contract to equivalent amount of token1 and token2 reqeusted
    *@param to The address of the reciever
    *@return The amount of token1 and token2 requested by the caller
    */
    function burn(address to) external locker override returns(uint equivalentToken1, uint equivalentToken2) {
        /// The current amount of token1 held by the contract(can be different from reserve value)
        uint currentBalanceToken1 = IERC20(token1).balanceOf(address(this));
        /// The current amount of token2 held by the contract(can be different from reserve value)
        uint currentBalanceToken2 = IERC20(token2).balanceOf(address(this));
        /// The liquidityTokens supplied to contract beforehand
        uint liquidityTokenSupplied = balanceOf[address(this)];
        /// Check if some liquidity tokens have been provided to contract first
        require(liquidityTokenSupplied > 0, "Swappy: No liquidity to burn");
        /// Equivalent amount of token1 in return for liquidity token supplied
        equivalentToken1 = liquidityTokenSupplied.mul(currentBalanceToken1) / totalSupply;
        /// Equivalent amount of token2 in return for liquidity token supplied
        equivalentToken2 = liquidityTokenSupplied.mul(currentBalanceToken2) / totalSupply;
        require(equivalentToken1 > 0 && equivalentToken2 > 0, "Swappy: Insufficient liquidity burned");
        /// Destroy the amount of liquidity tokens
        _burn(address(this), liquidityTokenSupplied);
        /// Transfer equivalent amount to the provided address
        _safeTransfer(token1, to, equivalentToken1);
        _safeTransfer(token2, to, equivalentToken2);

        _update();
        emit Burn(msg.sender, equivalentToken1, equivalentToken2, to);
    }

    /**
    *@notice Draw a given amount of token1 and token2 from the contract, given that the invarient property is satisfied
    *@dev The amounts are initially transfered optimistically, but if the invarient property
    *is not satisfied later the transaction is reverted
    *@param token1Amount The amount of token1 that caller wants to withdraw
    *@param token2Amount The amount of token2 that caller wants to withdraw
    */
    function drawTokens(uint256 token1Amount, uint256 token2Amount, address to)
        external locker override
    {
        uint256 initialReserveToken1 = reserve1;
        uint256 initialReserveToken2 = reserve2;
        require(
            token1Amount > 0 || token2Amount > 0,
            "Swappy: One of the amount should be greater than 1"
        );
        require(
            token1Amount <= reserve1 && token2Amount <= reserve2,
            "Swappy: Amount taken out should be less than reserves"
        );
        /// Optimistically transfer token1 amount to the provided address
        if (token1Amount > 0) _safeTransfer(token1, to, token1Amount);
        /// Optimistically transfer token2 amount to the provided address
        if (token2Amount > 0) _safeTransfer(token2, to, token2Amount);
        /// The current amount of token1 held by the contract(can be different from reserve value)
        uint256 currentBalanceToken1 = IERC20(token1).balanceOf(address(this));
        /// The current amount of token2 held by the contract(can be different from reserve value)
        uint256 currentBalanceToken2 = IERC20(token2).balanceOf(address(this));

        /// The excess token1 supplied to contract to satisfy invarient property after transfer
        uint256 excessToken1 = currentBalanceToken1 >
            initialReserveToken1 - token1Amount
            ? currentBalanceToken1 - (initialReserveToken1 - token1Amount)
            : 0;

        /// The excess token2 supplied to contract to satisfy invarient property after transfer
        uint256 excessToken2 = currentBalanceToken2 >
            initialReserveToken2 - token2Amount
            ? currentBalanceToken2 - (initialReserveToken2 - token2Amount)
            : 0;

        require(
            excessToken1 > 0 || excessToken2 > 0,
            "Swappy: To draw tokens some amount of tokens should be supplied to contract"
        );

        /// Remove 0.03% of excess token1 as transaction fees to be provided to liquidity providers
        uint256 adjustedBalanceToken1 = currentBalanceToken1.mul(1000).sub(
            excessToken1.mul(3)
        );
        /// Remove a 0.03% of excess token2 as transaction fees to be provided to liquidity providers
        uint256 adjustedBalanceToken2 = currentBalanceToken2.mul(1000).sub(
            excessToken2.mul(3)
        );
        require(
            adjustedBalanceToken1.mul(adjustedBalanceToken2) >=
                uint256(initialReserveToken1).mul(initialReserveToken2).mul(
                    1000**2
                ),
            "Swappy: Invarient"
        );
        _update();
        emit DrawTokens(
            msg.sender,
            excessToken1,
            excessToken2,
            token1Amount,
            token2Amount,
            to
        );
    }

    function skim(address to) external locker {
        _safeTransfer(
            token1,
            to,
            IERC20(token1).balanceOf(address(this)).sub(reserve1)
        );
        _safeTransfer(
            token2,
            to,
            IERC20(token2).balanceOf(address(this)).sub(reserve2)
        );
    }
}
