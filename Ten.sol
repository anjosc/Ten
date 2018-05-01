pragma solidity ^0.4.23;

import "./ownable.sol";

contract Ten is Ownable {
    
    address[10] private betters ;
    uint nonce = 0;
    uint public minBet = 0.1 ether;

    function bet() payable public {
        require(msg.value >= minBet );
        uint idx = nonce % 10;
        betters[idx] = msg.sender ;
        if (idx == 9){
            //pseudo random selection
            idx = uint(keccak256(now, msg.sender, nonce)) % 10;
            betters[idx].transfer(address(this).balance);
        }
        nonce ++;
    }
    
    function setMinBet(uint _minBet) public onlyOwner {
        minBet = _minBet;
    }
    
    function pot() public view  returns (uint) {
        return address(this).balance;
    }
}