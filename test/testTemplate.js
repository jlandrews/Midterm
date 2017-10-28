'use strict';

/* Add the dependencies you're testing */
const Crowdsale = artifacts.require("./Crowdsale.sol");
const Token = artifacts.require("./Token.sol");
const Queue = artifacts.require("./Queue.sol");
// YOUR CODE HERE

contract('Crowdsale Tests', function(accounts) {
	/* Define your constant variables and instantiate constantly changing
	 * ones
	 */
	const args = {};
	let crowdsale, queue, token;

	function promiseToThrow(p,msg) {
	  return p.then(_ => false).catch(_ => true).then(res => assert(res, msg));
	}
	// YOUR CODE HERE


	/* Group test cases together
	 * Make sure to provide descriptive strings for method arguements and
	 * assert statements
	 */
	describe('Token', function() {
		beforeEach(function() {
			return Token.new(40000, {from: accounts[0]}).then(instance => {
				token = instance;
			})
		})
		it("Should set totalSupply properly in constrctor", function() {
			return token.totalSupply.call().then(ts => {
				assert.equal(ts, 40000, "Should be value from constructor");
			})
		});
	});

	describe('Crowdsale', function() {

		beforeEach(async function() {
			crowdsale = await Crowdsale.new(3, 10, 10000, 10, {from: accounts[0]});
			token = Token.at(await crowdsale.token.call());
			queue = Queue.at(await crowdsale.queue.call());
		});

		it("should allow buyer to join queue", async function() {
			await queue.enqueue(accounts[1]);
			let first = await queue.getFirst.call();
			assert.equal(first, accounts[1], "getting first in the queue should return buyer");
		});

		it("should allow buyer to buy, if they are first and someone is behind them", async function() {
			await queue.enqueue(accounts[1]);
			await queue.enqueue(accounts[2]);
			await crowdsale.buy({from: accounts[1], value: 10});
			let b = await token.balanceOf.call(accounts[1]);
			assert.equal(b, 100, "buyer should have 100 tokens");
			let numSold = await crowdsale.numSold.call();
			assert.equal(numSold, 100, "numSold should also be 100");
		});

		it("should buyers to wait their turn", async function() {
			await queue.enqueue(accounts[1]);
			await queue.enqueue(accounts[2]);
			await queue.enqueue(accounts[3]);
			await crowdsale.buy({from: accounts[1], value: 10});
			let b1 = await token.balanceOf.call(accounts[1]);
			assert.equal(b1, 100, "buyer 1 should have 100 tokens");
			let numSold = await crowdsale.numSold.call();
			assert.equal(numSold, 100, "numSold should also be 100");
			await crowdsale.buy({from: accounts[2], value: 30})
			let b2 = await token.balanceOf.call(accounts[2]);
			assert.equal(b2, 300, "buyer 2 should have 100 tokens");
			numSold = await crowdsale.numSold.call();
			assert.equal(numSold, 400, "numSold should now be 400");
		});

		it("should block buyer from buying if they are not first in the queue", async function() {
			await queue.enqueue(accounts[1]);
			await queue.enqueue(accounts[2]);
		  promiseToThrow(crowdsale.buy({from: accounts[2], value: 10}));
		});

		it("should block buyer from buying if there is no one behind them in queue", async function() {
			await queue.enqueue(accounts[1]);
			promiseToThrow(crowdsale.buy({from: accounts[1], value: 10}));
		});

		it("should block buyer from going over the sale cap", async function() {
			await queue.enqueue(accounts[1]);
			await queue.enqueue(accounts[2]);
			promiseToThrow(crowdsale.buy({from: accounts[1], value: 2000}));
		});

		it("should block buyer from buying after sale ends", async function() {
			await queue.enqueue(accounts[1]);
		  await queue.enqueue(accounts[2]);
			await (new Promise(resolve => setTimeout(resolve, 5000)));
			promiseToThrow(crowdsale.buy({from: accounts[1], value: 10}));
		});

		it("should allow token holder to get a refund", async function() {
			await queue.enqueue(accounts[1]);
			await queue.enqueue(accounts[2]);
			await crowdsale.buy({from: accounts[1], value: 1000});
			await crowdsale.refund(5000, {from: accounts[1]});
			let b = await token.balanceOf.call(accounts[1]);
			assert.equal(b, 5000, "buyer should now have 50 tokens");
			let numSold = await crowdsale.numSold.call();
			assert.equal(numSold, 5000, "numSold should be set back down to 50");
			let deposit = await crowdsale.depositOf.call(accounts[1]);
			assert.equal(deposit, 500, "buyer should have 5 wei of deposit");
			await crowdsale.withdraw(500, {from: accounts[1]});
			deposit = await crowdsale.depositOf.call(accounts[1]);
			assert.equal(deposit, 0, "buyer should have no more deposit after withdrawal");
		});

		it("should allow owner to mint tokens", async function() {
			await crowdsale.ownerMint(accounts[0], 100, {from: accounts[0]});
			await crowdsale.ownerMint(accounts[1], 20, {from: accounts[0]});
			let b0 = await token.balanceOf.call(accounts[0]);
			assert.equal(b0, 100);
			let b1 = await token.balanceOf.call(accounts[1]);
			assert.equal(b1, 20);
		});

		it("should not allow a non owner to mint tokens", async function() {
			promiseToThrow(crowdsale.ownerMint(accounts[1], 100, {from: accounts[1]}));
		});

		it("should fail if a user tries to withdraw more than their deposits", async function() {
			promiseToThrow(crowdsale.withdraw(1000, {from: accounts[1]}));
		});

		it("fallback function should revert", async function() {
			promiseToThrow(crowdsale.send(10), "should throw an exception");
		});

		it("should block owner from withdrawing ether before sale is over", async function () {
			await queue.enqueue(accounts[1]);
			await queue.enqueue(accounts[2]);
			await crowdsale.buy({from: accounts[1], value: 10});
			promiseToThrow(crowdsale.ownerWithdraw({from: accounts[0]}));
		});

		it("should allow owner to withdraw after sale is over", async function() {
			await queue.enqueue(accounts[1]);
			await queue.enqueue(accounts[2]);
			await crowdsale.buy({from: accounts[1], value: 10});
			await (new Promise(resolve => setTimeout(resolve, 5000)));
			await crowdsale.ownerWithdraw({from: accounts[0]});
			assert.equal(true,true,"dummy assertion");
		});


	});
});
