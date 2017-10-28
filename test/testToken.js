// 'use strict';
//
// /* Add the dependencies you're testing */
// const Crowdsale = artifacts.require("./Crowdsale.sol");
// const Token = artifacts.require("./Token.sol");
// const Queue = artifacts.require("./Queue.sol")
// // YOUR CODE HERE
//
// contract('testToken', function(accounts) {
// 	/* Define your constant variables and instantiate constantly changing
// 	 * ones
// 	 */
// 	const args = {};
// 	let token;
// 	// YOUR CODE HERE
//
// 	describe('~~~Token~~~', function() {
// 			beforeEach(function() {
// 				return Token.new(40000, {from: accounts[0]}).then(instance => {
// 					token = instance;
// 				})
// 			})
// 			it("Should set totalSupply properly in constrctor", function() {
// 				return token.totalSupply.call().then(ts => {
// 					// console.log(ts);
// 					assert.equal(ts, 40000, "Should be value from constructor");
// 				})
// 			})
// 			it("Balance should be stored for sender in constructor", function() {
// 				return token.balanceOf(accounts[0]).then(ba => {
// 					assert.equal(ba, 40000, "Should be same as initial");
// 				})
// 			})
// 			it("Should send value from sender to receiver", function() {
// 				return token.transfer(accounts[1],20000, {from: accounts[0]}).then(function() {
// 					return token.balanceOf(accounts[1]).then(ba => {
// 						// console.log(ba);
// 						assert.equal(ba, 20000, "Should be half of initial setting");
// 					})
// 				})
// 			})
// 			it("Should throw error if trying to send value without approval", function() {
// 				return token.transferFrom(accounts[0], accounts[1], 20000).catch(function(error) {
// 					console.log("caught the expected error: allowance not set");
// 				})
// 			})
// 			it("Should set the allowances after approval", function() {
// 				return token.approve(accounts[1], 20000, {from: accounts[0]}).then(function() {
// 					return token.allowance(accounts[0], accounts[1]).then(all => {
// 						assert.equal(all, 20000, "allowance should be set to 20000");
// 					})
// 				})
// 			})
// 			it("Should transfer value after allowances are set", function() {
// 				return token.approve(accounts[1], 20000, {from: accounts[0]}).then(function() {
// 					return token.transferFrom(accounts[0], accounts[1], 10000).then(function() {
// 						return token.balanceOf(accounts[1]).then(ba => {
// 							assert.equal(ba, 10000, "Transferred value to receiver");
// 						})
// 					})
// 				})
// 			})
// 			it("Should throw error if value transferred is greater than allowance", function() {
// 				return token.approve(accounts[1], 20000, {from: accounts[0]}).then(function() {
// 					return token.transferFrom(accounts[0], accounts[1], 30000).catch(function(error) {
// 						console.log("caught the expected error: over allowance");
// 					})
// 				})
// 			})
// 			it("Should mint new tokens, update the total supply", function() {
// 				return token.mint(accounts[0], 10000).then(function() {
// 					return token.totalSupply.call().then(ts => {
// 						assert.equal(ts, 50000, "supply updated");
// 					})
// 				})
// 			})
// 			it("Should store the new tokens in the owners balance", function() {
// 				return token.mint(accounts[0], 10000).then(function() {
// 					return token.balanceOf(accounts[0]).then(ba => {
// 						assert.equal(ba, 50000, "owner account updated");
// 					})
// 				})
// 			})
// 			it("Should burn the unsold tokens", function() {
// 				return token.burn(10000, {from: accounts[0]}).then(function() {
// 					return token.balanceOf(accounts[0]).then(ba => {
// 						assert.equal(ba, 30000, "tokens burnt");
// 					})
// 				})
// 			})
// 			it("Should not be able to burn more than unsold tokens", function() {
// 				return token.burn(50000, {from: accounts[0]}).catch(function() {
// 					console.log("caught the expected error: burning more than allowed");
// 				})
// 			})
// 			// YOUR CODE HERE
// 		});
//
// 	// describe('Your string here', function() {
// 	// 	// YOUR CODE HERE
// 	// });
// });
