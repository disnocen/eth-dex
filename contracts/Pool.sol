// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface IERC20 {
    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);

    function allowance(
        address owner,
        address spender
    ) external view returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract TokenExchange {
    address public tokenA;
    address public tokenB;
    uint256 public exchangeRate; // rate of Token B per Token A

    constructor(address _tokenA, address _tokenB, uint256 _exchangeRate) {
        tokenA = _tokenA;
        tokenB = _tokenB;
        exchangeRate = _exchangeRate;
    }

    function getBAmount(uint256 amountA) public view returns (uint256) {
        uint256 balanceA = IERC20(tokenA).balanceOf(address(this));
        uint256 balanceB = IERC20(tokenB).balanceOf(address(this));
        return (amountA * balanceB * 1000) / (balanceA * exchangeRate);
    }

    function swapAtoB(uint256 amountA) public {
        address user = msg.sender;
        // Check if the user has approved the contract to spend their Token A
        require(
            IERC20(tokenA).allowance(user, address(this)) >= amountA,
            "TokenExchange: Insufficient allowance"
        );

        // Calculate the amount of Token B to return to the user
        uint256 amountB = getBAmount(amountA);

        // Transfer the Token A from the user to the contract
        require(
            IERC20(tokenA).transferFrom(user, address(this), amountA),
            "TokenExchange: Transfer failed"
        );

        // Transfer the calculated amount of Token B from the contract to the user
        require(
            IERC20(tokenB).transfer(user, amountB),
            "TokenExchange: Transfer failed"
        );
    }

function swapBtoA(uint256 amountB) public {
        address user = msg.sender;
        // Check if the user has approved the contract to spend their Token A
        require(
            IERC20(tokenB).allowance(user, address(this)) >= amountB,
            "TokenExchange: Insufficient allowance"
        );

        // Calculate the amount of Token B to return to the user
        uint256 amountA = getBAmount(amountB);

        // Transfer the Token A from the user to the contract
        require(
            IERC20(tokenB).transferFrom(user, address(this), amountB),
            "TokenExchange: Transfer failed"
        );

        // Transfer the calculated amount of Token B from the contract to the user
        require(
            IERC20(tokenA).transfer(user, amountA),
            "TokenExchange: Transfer failed"
        );
    }
}
