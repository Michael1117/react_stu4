react
react-dom
react-reconciler
scheduler
shared

20:00

React 18 之前使用 effectList 收集副作用，现在为什么用递归了

export function processUpdateQueue(workInProgress) {
const queue = workInProgress.updateQueue;
const pendingQueue = queue.shared.pending;

if (pendingQueue !== null) {

    queue.shared.pending = null;

    const lastPendingUpdate = pendingQueue;

    const firstPendingUpdate = lastPendingUpdate.next;

    lastPendingUpdate.next = null;

    let newState = workInProgress.memoizedState;
    let update = firstPendingUpdate;
    while (update) {

      newState = getStateFromUpdate(update, newState);
    }

    workInProgress.memoizedState = newState;

}
}
