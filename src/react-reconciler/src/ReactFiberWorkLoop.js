import { scheduleCallback } from "scheduler";
import { createWorkInProgress } from "./ReactFiber";
import { beginWork } from "./ReactFiberBeginWork";
import { completeWork } from "./ReactFiberCompleteWork";

let workInProgress = null;

//console.log(scheduleCallback);
export function scheduleUpdateOnFiber(root) {
  ensureRootIsScheduled(root);

  // scheduleCallback(() => {
  //   // 在这里执行更新
  // });
}

function ensureRootIsScheduled(root) {
  // 告诉浏览器要执行performConcurrentWorkOnRoot
  scheduleCallback(performConcurrentWorkOnRoot.bind(null, root));
}

function performConcurrentWorkOnRoot(root) {
  //console.log(root);
  //console.log("performConcurrentWorkOnRoot", root);
  renderRootSync(root);
}

function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, null);
  //console.log(workInProgress);
}
function renderRootSync(root) {
  // 开始构建fiber树
  prepareFreshStack(root);
  workLoopSync();
}

function workLoopSync() {
  while (workInProgress != null) {
    performUnitOfWork(workInProgress);
  }
}

function performUnitOfWork(unitOfWork) {
  //console.log(unitOfWork);
  const current = unitOfWork.alternate;
  const next = beginWork(current, unitOfWork);
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  // 如果没有子节点表示当前的fiber已经处理完了
  if (next === null) {
    //
    // workInProgress = null;
    completeUnitOfWork(unitOfWork);
  } else {
    // 如果有子节点，就让子节点成为下一个工作单元
    workInProgress = next;
  }
}

function completeUnitOfWork(unitOfWork) {
  let completedWork = unitOfWork;
  do {
    const current = completedWork.alternate;
    const returnFiber = completedWork.return;
    // 执行此fiber的完成工作，如果是原生组件的话就是创建真实的DOM节点
    completeWork(current, completedWork);
    // 如果有弟第， 就构建弟第对应的fiber子链表
    const siblingFiber = completedWork.sibling;
    if (siblingFiber !== null) {
      workInProgress = siblingFiber;
      return;
    }
    // 如果没有弟第，说明当前完成的就是父fiber的最后一个节点
    // 也就是说一个父fiber，所有的子fiber全部完成了
    completedWork = returnFiber;
    workInProgress = completedWork;
  } while (completedWork !== null);
}
