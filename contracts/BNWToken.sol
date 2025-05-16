// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BNWToken is ERC20, Ownable {
    string private _tokenURI;

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        string memory tokenURI_
    ) ERC20(name, symbol) Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * 10 ** decimals());
        if (bytes(tokenURI_).length > 0) {
            _tokenURI = tokenURI_;
        }
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    /**
     * @dev Returns the URI where the token metadata, including the logo, is stored
     */
    function tokenURI() public view returns (string memory) {
        return _tokenURI;
    }

    /**
     * @dev Updates the token URI where metadata is stored
     * @param newTokenURI The new URI for the token metadata
     */
    function setTokenURI(string memory newTokenURI) public onlyOwner {
        _tokenURI = newTokenURI;
    }
} 