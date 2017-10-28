'use strict';

const Queue = artifacts.require("./Queue.sol");

contract('QueueTest', function(accounts) {
	/* Define your constant variables and instantiate constantly changing
	 * ones
	 */
	// const args = {};
	// let x, y, z;
	// YOUR CODE HERE
  let q;

	/* Do something before every `describe` method */
	beforeEach(async function() {
		// YOUR CODE HERE
    let qInstance = await Queue.new(60);
    q = qInstance;
	});

	/* Group test cases together
	 * Make sure to provide descriptive strings for method arguements and
	 * assert statements
	 */
	describe('Queue Size Tests', function() {
		it("The queue size is 0 at the beginning", async function() {
      let size = await q.qsize.call();
      console.log(size);
			assert.equal(size, 0, "size is 0");
		}),
    it("Adding a buyer should increase the size to 1", async function() {
      await q.enqueue(0);
      let size = await q.qsize.call();
			assert.equal(size, 1, "size is 1");
		}),
    it("Removing a buyer should decrease the size", async function() {
      await q.enqueue(1);
      await q.enqueue(2);
      let size = await q.qsize.call();
      console.log(size);
      assert.equal(parseInt(size), 2, "size is 2");
      await q.dequeue();
      size = await q.qsize.call();
      assert.equal(parseInt(size), 1, "size is 1")
    });
    it("", async function() {
      await q.enqueue(1);
      await q.enqueue(2);
      let size = await q.qsize.call();
      console.log(size);
      assert.equal(parseInt(size), 2, "size is 2");
      await q.dequeue();
      size = await q.qsize.call();
      assert.equal(parseInt(size), 1, "size is 1")
    })
		// YOUR CODE HERE
	});

	// describe('Your string here', function() {
	// 	// YOUR CODE HERE
	// });
});