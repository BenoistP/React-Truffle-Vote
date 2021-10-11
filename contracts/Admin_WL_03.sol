// Défi - Système de vote
// https://ecole.alyra.fr/mod/assign/view.php?id=727

// Admin_WL_03.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.6.11;


// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/access/Ownable.sol
// import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/release-v3.1.0/contracts/access/Ownable.sol";
//import '@openzeppelin/contracts/access/Ownable.sol';
import "./openzeppelin-contracts/contracts/access/Ownable.sol";

    // Dependencies :
     // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.1.0/contracts/GSN/Context.sol
     // https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/release-v3.1.0/contracts/GSN/Context.sol

contract Admin_WL_03 is Ownable
{
    event Whitelisted ( address _address );
    
    
    mapping (address => bool) public _whitelist;
    address[] public _whitelistedAddresses;

    function whitelist(address _address) public virtual onlyOwner
     {
         require(!_whitelist[_address], "This address is already whitelisted !");
        _whitelist[ _address ] = true;
        _whitelistedAddresses.push(_address); // Ajout à la liste publique des adresses "whitelisted"
        emit Whitelisted( _address );
     } // function whitelist

    function isWhitelisted(address _address) public view returns (bool)
     {
        return _whitelist[_address];
     } // function isWhitelisted
 
    modifier whitelisted(address _address)
     {
         require( _whitelist[_address] == true, "Not whitelisted." );
         _;
     }
    
   function getWhiteListedAddresses() public view returns(address[] memory){
       return _whitelistedAddresses;
   }
} // contract Admin_WL is Ownable