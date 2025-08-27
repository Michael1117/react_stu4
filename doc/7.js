function initialUpdateQueue(fiber) {
  // 创建一个新的更新队列
  // pending是一个循环链表
  const queue = {
    shared: {
      pending: null,
    },
  };
  fiber.updateQueue = queue;
}

function createUpdate() {
  return {};
}

function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  const shared = updateQueue.shared;
  const pending = shared.pending;
  if (pending === null) {
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  updateQueue.shared.pending = update;
}

function processUpdateQueue(fiber) {
  const queue = fiber.updateQueue;
  const pending = queue.shared.pending;
  if (pending !== null) {
    queue.shared.pending = null; // 清空pending
    const lastPendingUpdate = pending;
    const firstPendingUpdate = pending.next;
    lastPendingUpdate.next = null; // 断开循环链表
    let newState = fiber.memoizedState; // 初始状态
    let update = firstPendingUpdate;
    while (update) {
      newState = getStateFromUpdate(update, newState);
      update = update.next;
    }
    fiber.memoizedState = newState;
  }
}

function getStateFromUpdate(update, newState) {
  return Object.assign({}, newState, update.payload);
}

let fiber = { memoizedState: { id: 1 } };
initialUpdateQueue(fiber);
let update1 = createUpdate();
update1.payload = { name: "Jack" };
enqueueUpdate(fiber, update1);

// E=mc²，光速

let update2 = createUpdate();
update2.payload = { age: 18 };
enqueueUpdate(fiber, update2);

processUpdateQueue(fiber);

console.log(fiber.memoizedState);
