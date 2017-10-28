// 'use strict';
//
// /* Add the dependencies you're testing */
// const Crowdsale = artifacts.require("./Crowdsale.sol");
// const Token = artifacts.require("./Token.sol");
// const Queue = artifacts.require("./Queue.sol");
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
// 	});
//
// 	describe('Crowdsale', function() {
//
// 		beforeEach(function() {
// 			return Crowdsale.new(600, 30, 10000, 10, {from: accounts[0]}).then(cs => {
// 				crowdsale = cs;
// 				return crowdsale.token.call().then(tk => {
// 					token = Token.at(tk);
// 					return crowdsale.queue.call().then(q => {
// 						queue = Queue.at(q);
// 					})
// 				})
// 			});
// 		});
//
// 		it("should allow buyer to join queue", function() {
// 			return queue.enqueue(accounts[1], {from: accounts[1]}).then(result => {
// 				return queue.getFirst.call().then(first => {
// 					assert.equal(first, accounts[1], "getting first in the queue should return buyer");
// 				});
// 			});
// 		});
//
// 		it("should allow buyer to buy, if they are first and someone is behind them", function() {
// 			return queue.enqueue(accounts[1], {from: accounts[1]}).then(result => {
// 				return queue.enqueue(accounts[2], {from: accounts[2]}).then(result => {
// 					return crowdsale.buy({from: accounts[1], value: 10}).then(result => {
// 						return token.balanceOf.call(accounts[1]).then(balance => {
// 							assert.equal(balance, 100, "buyer should have 100 tokens");
// 						});
// 					});
// 				});
// 			});
// 		});
//
//
// 	});
// });
