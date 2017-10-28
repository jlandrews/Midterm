pragma solidity ^0.4.15;

import './Queue.sol';
import './Token.sol';
import './utils/SafeMath.sol';

/**
 * @title Crowdsale
 * @dev Contract that deploys `Token.sol`
 * Is timelocked, manages buyer queue, updates balances on `Token.sol`
 */

contract Crowdsale {
  Token public token;
  Queue public queue;
  uint public tokensPerWei;
  uint public tokenSaleCap;
  uint public numSold;
  address public owner;
  uint public startTime;
  uint public endTime;

  mapping (address => uint) deposits;

  modifier onlyOwner() {require(msg.sender == owner); _;}
  modifier windowOpen() {require(now < endTime); _;}
  modifier windowClosed() {require(now > endTime); _;}

  event TokensSold(address user, uint amount);
  event TokensRefunded(address user, uint amount);

  function Crowdsale(uint saleTimeLimit, uint queueTimeLimit, uint initialTokens, uint _tokensPerWei) {
    tokenSaleCap = initialTokens;
    tokensPerWei = _tokensPerWei;
    token = new Token(initialTokens);
    queue = new Queue(queueTimeLimit);
    owner = msg.sender;
    startTime = now;
    endTime = SafeMath.add(startTime, saleTimeLimit);
  }

  function () public payable {revert();}

  function buy() public payable windowOpen() {
    require(queue.getFirst() == msg.sender);
    require(queue.qsize() > 1);
    uint amount = SafeMath.mul(tokensPerWei, msg.value);
    require((tokenSaleCap - numSold) >= amount);
    token.transfer(msg.sender, amount);
    numSold = SafeMath.add(numSold, amount);
    queue.externDequeue();
    TokensSold(msg.sender, amount);
  }

  function refund(uint amount) public windowOpen() {
    token.refund(msg.sender, amount);
    uint eth = SafeMath.div(amount, tokensPerWei);
    deposits[msg.sender] = SafeMath.add(deposits[msg.sender], eth);
    numSold = SafeMath.sub(numSold, amount);
    TokensRefunded(msg.sender, amount);
  }

  function depositOf(address user) public returns (uint) {
    return deposits[user];
  }

  function withdraw(uint amount) public {
    require(deposits[msg.sender] >= amount);
    deposits[msg.sender] = SafeMath.sub(deposits[msg.sender], amount);
    msg.sender.transfer(amount);
  }

  function ownerWithdraw() public
  onlyOwner()
  windowClosed()
  {
    owner.transfer(SafeMath.div(numSold, tokensPerWei));
  }

  function ownerMint(address receiver, uint amount) public onlyOwner() {
    token.mint(receiver, amount);
  }

  function ownerBurnUnsold() public onlyOwner() windowClosed() {
    token.burn(tokenSaleCap - numSold);
  }


}
