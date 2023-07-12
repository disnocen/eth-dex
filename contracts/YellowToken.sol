// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract YellowToken is ERC20 {
    constructor(uint256 totalSupply) ERC20("YellowToken", "YTK") {
        console.log("----- YellowToken.sol");
        _mint(msg.sender, totalSupply);
    }
}
