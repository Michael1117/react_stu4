import { markUpdateLaneFromFiberToRoot } from "./ReactFiberConcurrentUpdates";
import assign from "shared/assign";
export const UpdateState = 0;
export function initialUpdateQueue(fiber) {
  // 创建一个新的更新队列
  // pending是一个循环链表
  const queue = {
    shared: {
      pending: null,
    },
  };
  fiber.updateQueue = queue;
}

export function createUpdate() {
  const update = { tag: UpdateState };
  return update;
}

export function enqueueUpdate(fiber, update) {
  const updateQueue = fiber.updateQueue;
  const pending = updateQueue.shared.pending;
  if (pending === null) {
    update.next = update;
  } else {
    update.next = pending.next;
    pending.next = update;
  }
  updateQueue.shared.pending = update;
  //let root = markUpdateLaneFromFiberToRoot(fiber);
  //return root;
  return markUpdateLaneFromFiberToRoot(fiber);
  //console.log(root);
}

/**
 *
 * @param {*} workInProgress
 */
export function processUpdateQueue(workInProgress) {
  const queue = workInProgress.updateQueue;
  const pendingQueue = queue.shared.pending;
  // 如果有更新， 或者更新队列有内容
  if (pendingQueue !== null) {
    // 清除等待生效的更新
    queue.shared.pending = null;
    // 获取更新队列中最后一个更新 update = {payload: {element: 'h1'}}
    const lastPendingUpdate = pendingQueue;
    // 指向第一个更新
    const firstPendingUpdate = lastPendingUpdate.next;
    // 把更新链表解开  循环链表变成单链表
    lastPendingUpdate.next = null;
    // 获取老状态 null
    let newState = workInProgress.memoizedState;
    let update = firstPendingUpdate;
    while (update) {
      // 根据老状态和更新 计算新状态
      newState = getStateFromUpdate(update, newState);
      update = update.next;
    }
    //console.log("newState", newState);
    // 将计算出的新状态赋值给 workInProgress.memoizedState
    workInProgress.memoizedState = newState;
    //console.log(workInProgress.pendingProps);
    //console.log(workInProgress)
  }
}

/**
 *
 * @param {*} update
 * @param {*} prevState
 * @returns
 */
function getStateFromUpdate(update, prevState) {
  switch (update.tag) {
    case UpdateState:
      const { payload } = update;
      return assign({}, prevState, payload);
  }
}
