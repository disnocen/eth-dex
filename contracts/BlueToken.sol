// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract BlueToken is ERC20 {
    constructor(uint256 totalSupply) ERC20("BlueToken", "BTK") {
        console.log("----- BlueToken.sol");
        _mint(msg.sender, totalSupply);
    }
}
