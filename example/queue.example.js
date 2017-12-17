const Queue = require('../lib/queue');

function taskA(arg) {
  console.log(`taskA(${arg})`);
  return 'result of A';
}

function taskB(arg) {
  return new Promise((resolve) => {
    setTimeout(resolve, 100);
  }).then(() => {
    console.log(`taskB(${arg})`);
    return 'result of B';
  });
}

async function taskC(arg) {
  console.log(`taskC(${arg})`);
  return 'result of C';
}

function taskD(arg) {
  console.log(`taskD(${arg})`);
  return 'result of D';
}

const queue = new Queue();
queue.push(taskA);
queue.push(taskB);
queue.push(taskC);
setTimeout(() => {
  queue.push(taskD);
}, 1000);


/**
 * console:
 *
 * taskA(null)
 * taskB(result of A)
 * taskC(result of B)
 * taskD(result of C)
 */
