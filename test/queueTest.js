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
  let maxSize;

	/* Do something before every `describe` method */
	beforeEach(async function() {
		// YOUR CODE HERE
    let qInstance = await Queue.new(3);
    q = qInstance;
    maxSize = await q.getMaxSize.call();
	});

  function promiseToThrow(p,msg) {
    return p.then(_ => false).catch(_ => true).then(res =>
      assert(res, msg));
   }
   /*
   promiseToThrow example:
   it("should not allow funds to be sent directly to the contract", () => {
    return promiseToThrow(
      betcon.send(10), "transaction should throw exception"
    );
    });
   */

	/* Group test cases together
	 * Make sure to provide descriptive strings for method arguements and
	 * assert statements
	 */
	describe('Basic Queue Size Tests', function() {
		it("The queue size is 0 at the beginning", async function() {
      let size = await q.qsize.call();
			assert.equal(size, 0, "size is 0");
      let isEmpty = await q.empty.call();
      assert.isOk(isEmpty);
		}),
    it("Adding a buyer should increase the size to 1", async function() {
      await q.enqueue(0);
      let size = await q.qsize.call();
			assert.equal(size, 1, "size is 1");
      let isEmpty = await q.empty.call();
      assert.isNotOk(isEmpty);
		}),
    it("Adding 2 buyers, then removing a buyer should decrease the size to 1", async function() {
      await q.enqueue(1);
      await q.enqueue(2);
      let size = await q.qsize.call();
      assert.equal(parseInt(size), 2, "size is 2");
      await q.externDequeue();
      let isEmpty = await q.empty.call();
      assert.isNotOk(isEmpty);
      size = await q.qsize.call();
      assert.equal(parseInt(size), 1, "size is 1")
    })

	});

	describe('Enqueue and Dequeue Tests', function() {
    it("The beginning of the queue is the item we added", async function() {
      await q.enqueue(accounts[0]);
      // let beg = await q.getFirst.call();
      // assert.equal(parseInt(beg), accounts, "first user is 99")
      let pos = await q.checkPlace.call({from: accounts[0]});
      assert.equal(pos, 0, "position 0");
		}),
    it("getFirst throws an error if no one is in queue", async function() {
      promiseToThrow(q.getFirst.call(), "no one is in the queue, error");
		}),
    it("getFirst gets the first item in the queue after something is dequeued", async function() {
      await q.enqueue(0);
      await q.enqueue(1);
      await q.externDequeue();
      let beg = await q.getFirst.call();
      assert.equal(beg, 1, "first buyer in the queue should be address 1");
		}),
    it("Adding items should increase the size, and adding when queue is full should throw error", async function() {
      for (let i = 0; i < maxSize; i++){
        await q.enqueue(i);
      }
      let size = await q.qsize.call();
      assert.equal(parseInt(size), maxSize, "size is max size");
      promiseToThrow(q.enqueue(q.size+1), "enqueueing when queue is full should throw an error")
    }),
    it("Removing items should decrease the size, and removing when queue is empty should throw error", async function() {
      for (let i = 0; i < maxSize; i++){
        await q.enqueue(i);
      }
      let size = await q.qsize.call();
      assert.equal(parseInt(size), maxSize, "size is maxSize");
      let isEmpty = await q.empty.call();
      assert.isNotOk(isEmpty);

      for (let i = maxSize; i > 0; i--){
        await q.externDequeue();
      }
      promiseToThrow(q.getFirst.call(), "no one is in the queue, error");
      size = await q.qsize.call();
      assert.equal(parseInt(size), 0, "size is 0");
      isEmpty = await q.empty.call();
      assert.isOk(isEmpty);
		}),
    it("Correct sizes and getFirsts of a series of enqueuing and dequeuing sequences", async function() {
      for (let i = 0; i < 4; i++){
        await q.enqueue(i);
      }
      await q.externDequeue();
      await q.externDequeue();
      let beg = await q.getFirst.call();
      assert.equal(beg, 2, "first buyer in the queue should be address 2");
      await q.enqueue(4);
      await q.enqueue(5);
      await q.enqueue(6);
      beg = await q.getFirst.call();
      assert.equal(beg, 2, "first buyer in the queue should be address 2");
      let size = await q.qsize.call();
      assert.equal(size, 5, "size should be 5");
      await q.externDequeue();
      beg = await q.getFirst.call();
      assert.equal(beg, 3, "first buyer in the queue should be address 3");
      await q.enqueue(7);
      promiseToThrow(q.enqueue(8), "queue is full");
      for (let i = 0; i<4; i++){
        await q.externDequeue();
      }
      size = await q.qsize.call();
      assert.equal(size, 1, "size should be 1");
      beg = await q.getFirst.call();
      assert.equal(beg, 7, "first buyer in the queue should be address 7");
		})
	});

  // describe('CheckTime Test', function() {
  //   it("Should kick out first person in queue if his/her time is up", async function() {
  //     await q.enqueue(0);
  //     setTimeout(function(){
  //       return q.qsize.call()
  //       .then(function () {
  //         assert.equal(size, 0, "time is up");
  //       });
  //     }, 3000);
  //   })
  // });

  // function hi() {
  //   let size = await q.qsize.call();
  //   assertEquals(size, 0, "time is up");
  //   console.log("hello");
  // }
});
