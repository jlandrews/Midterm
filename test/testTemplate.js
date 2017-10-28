// 'use strict';
//
// /* Add the dependencies you're testing */
// const Crowdsale = artifacts.require("./Crowdsale.sol");
// const Token = artifacts.require("./Token.sol");
// // YOUR CODE HERE
//
// contract('Crowdsale Tests', function(accounts) {
// 	/* Define your constant variables and instantiate constantly changing
// 	 * ones
// 	 */
// 	const args = {};
// 	let crowdsale, queue, token;
// 	// YOUR CODE HERE
//
//
// 	/* Group test cases together
// 	 * Make sure to provide descriptive strings for method arguements and
// 	 * assert statements
// 	 */
// 	describe('Token', function() {
// 		beforeEach(function() {
// 			return Token.new(40000, {from: accounts[0]}).then(instance => {
// 				token = instance;
// 			})
// 		})
// 		it("Should set totalSupply properly in constrctor", function() {
// 			return token.totalSupply.call().then(ts => {
// 				assert.equal(ts, 40000, "Should be value from constructor");
// 			})
// 		});
// 		// YOUR CODE HERE
// 	});
//
// 	describe('Queue', function() {
// 		// YOUR CODE HERE
// 	});
//
// 	describe('Crowdsale', function() {
//
// 		beforeEach(function() {
// 			return Crowdsale.new(600, 30, 10000, 10, {from: accounts[0]}).then(cs => {
// 				crowdsale = cs;
// 			})
// 		});
//
// 		it("should allow buyer to join queue", function() {
// 			await crowdsale.joinQueue({from: accounts[1]});
// 			assert.equal(await crowdsale.getFirst.call(), accounts[1], "buyer should be first in queue");
// 		});
//
// 		it("should allow buyer to buy, if they are first and someone is behind them", function() {
// 			assert.fail();
// 		});
//
// 	});
// });
