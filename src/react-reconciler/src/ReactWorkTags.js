// 根Fiber的tag
// 每种虚拟DOM都会对应自己的Fiber  tag类型
export const IndeterminateComponent = 2;
export const HostRoot = 3;
export const HostComponent = 5;
export const HostText = 6;

// export function processUpdateQueue(workInProgress) {
//   const queue = workInProgress.updateQueue;
//   const pendingQueue = queue.shared.pending;
//   if (pendingQueue !== null) {
//     queue.shared.pending = null;
//     const lastPendingUpdate = pendingQueue;
//     const firstPendingUpdate = lastPendingUpdate.next;
//     lastPendingUpdate.next = null;
//     let newState = workInProgress.memoizedState;
//     let update = firstPendingUpdate;
//     while (update) {
//       newState = getStateFromUpdate(update, newState);
//     }
//     workInProgress.memoizedState = newState;
//   }
// }
