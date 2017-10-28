pragma solidity ^0.4.15;

import './interfaces/ERC20Interface.sol';
import './utils/SafeMath.sol';

/**
 * @title Token
 * @dev Contract that implements ERC20 token standard
 * Is deployed by `Crowdsale.sol`, keeps track of balances, etc.
 */
contract Token is ERC20Interface {
	uint public totalSupply;
	address owner;
  mapping (address => uint) balances;
  mapping (address => mapping (address => uint)) allowances;

  event Transfer(address sender, address receiver, uint amount);
	event Approval(address sender, address receiver, uint amount);

	modifier onlyOwner() {require(msg.sender == owner); _;}

  function balanceOf(address user) public constant returns (uint) {
    return balances[user];
  }

	function allowance(address sender, address receiver) public constant returns (uint) {
		return allowances[sender][receiver];
	}

  function transfer(address receiver, uint amount) public returns (bool) {
    require(balances[msg.sender] >= amount);
    balances[msg.sender] -= amount;
    balances[receiver] = SafeMath.add(balances[receiver], amount);
    Transfer(msg.sender, receiver, amount);
		return true;
  }

	function approve(address receiver, uint amount) public returns (bool) {
		allowances[msg.sender][receiver] += amount;
		Approval(msg.sender, receiver, amount);
		return true;
	}

	function transferFrom(address sender, address receiver, uint amount) public returns (bool) {
		require(balances[sender] >= amount);
		require(allowances[sender][receiver] >= amount);
		balances[sender] -= amount;
		balances[receiver] += amount;
		allowances[sender][receiver] -= amount;
		Transfer(sender, receiver, amount);
		return true;
	}

  event TokensBurned(address user, uint amount);

  function Token(uint amountToSell) {
    totalSupply = amountToSell;
    balances[msg.sender] = amountToSell;
		owner = msg.sender;
  }
	function refund(address holder, uint amount) public onlyOwner() {
		require(balances[holder] >= amount);
		balances[holder] -= amount;
		balances[owner] += amount;
	}
  function mint(address receiver, uint amount) public onlyOwner() {
    totalSupply = SafeMath.add(totalSupply, amount);
    balances[receiver] = SafeMath.add(balances[receiver], amount);
  }
  function burn(uint amount) public {
    require(balances[msg.sender] >= amount);
    totalSupply = SafeMath.sub(totalSupply, amount);
    balances[msg.sender] = SafeMath.sub(balances[msg.sender], amount);
    TokensBurned(msg.sender, amount);
  }
}
