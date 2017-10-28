pragma solidity ^0.4.15;

import './utils/SafeMath.sol';

/**
 * @title Queue
 * @dev Data structure contract used in `Crowdsale.sol`
 * Allows buyers to line up on a first-in-first-out basis
 * See this example: http://interactivepython.org/courselib/static/pythonds/BasicDS/ImplementingaQueueinPython.html
 */

contract Queue {

	struct QueueItem {
		address user;
		uint timeout;
	}

	/* State variables */
	uint timelimit;
	uint8 size = 5;
	uint8 currentSize;
	uint8 modShift;
	//Used to implement this as a circular queue
	//so that removal of the head is constant time

	QueueItem[5] items;
	address saleContract;

	event DEBUG(uint a, uint b);


	/* Add events */
	// YOUR CODE HERE

	/* Add constructor */
	// YOUR CODE HERE
	function Queue(uint _timelimit) {
		timelimit = _timelimit;
		saleContract = msg.sender;
	}

	/* Returns the number of people waiting in line */
	function qsize() public constant returns(uint8) {
		return currentSize;
	}

	/* Returns whether the queue is empty or not */
	function empty() public constant returns(bool) {
		return (currentSize == 0);
	}

	/* Returns the address of the person in the front of the queue */
	function getFirst() public constant returns(address) {
		require(currentSize > 0);
		return items[modShift].user;
	}

	/* Allows `msg.sender` to check their position in the queue */
	function checkPlace() public constant returns(uint8) {
		for (uint8 i=0; i<size; i++) {
			if (items[(modShift+i)%size].user == msg.sender) return i;
		}
		revert();//really should return -1, but uint8...
	}

	/* Allows anyone to expel the first person in line if their time
	 * limit is up
	 */
	function checkTime() public {
		DEBUG(items[modShift].timeout, now);
		if (items[modShift].timeout < now) dequeue();
	}

	/* Removes the first person in line; either when their time is up or when
	 * they are done with their purchase
	 */
	function dequeue() internal {
		delete items[modShift];
		modShift = (1+modShift)%size;
		currentSize -= 1;
		if (currentSize > 0) items[modShift].timeout = now + timelimit;
	}

	function externDequeue() public {
		require(msg.sender == saleContract);
		dequeue();
	}

	/* Places `addr` in the first empty position in the queue */
	function enqueue(address addr) public {
		require(currentSize < size);
		if (currentSize == 0)
			items[(modShift+currentSize)%size] = QueueItem(addr, now+timelimit);
		else
			items[(modShift+currentSize)%size] = QueueItem(addr, 0);
		currentSize += 1;
	}

	function getMaxSize() public returns(uint8) {
		return size;
	}
}
