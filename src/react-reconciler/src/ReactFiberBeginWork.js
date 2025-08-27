import logger, { indent } from "shared/logger";
import { HostComponent, HostRoot, HostText } from "./ReactWorkTags";
import { processUpdateQueue } from "./ReactFiberClassUpdateQueue";
import { mountChildFibers, reconcileChildFibers } from "./ReactChildFiber";
import { shouldSetTextContent } from "react-dom-bindings/src/ReactDOMHostConfig";
/**
 *  根据新的虚拟DOM生成新的Fiber链表
 * @param {*} current   老的父fiber
 * @param {*} workInProgress 新的父fiber
 * @param {*} nextChildren 新的子虚拟DOM
 */
function reconcileChildren(current, workInProgress, nextChildren) {
  //console.log(current);
  // fiber是新创建的
  if (current === null) {
    workInProgress.child = mountChildFibers(workInProgress, null, nextChildren);
  } else {
    // 如果有老的fiber  DOM-DIFF  进行最小化更新
    workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren);
  }
}
function updateHostRoot(current, workInProgress) {
  /*  processUpdateQueue(workInProgress);
  const nextState = workInProgress.memoizedState;
  const nextProps = workInProgress.pendingProps;
  console.log(workInProgress)
  let nextChildren = nextProps.children;
  debugger;
  // 根据新的虚拟DOM生成子fiber链表
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child; */

  processUpdateQueue(workInProgress);
  const nextState = workInProgress.memoizedState;

  let nextChildren = nextState.element;
  //console.log(nextChildren)
  //debugger;
  // 根据新的虚拟DOM生成子fiber链表
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}
function updateHostComponent(current, workInProgress) {
  const { type } = workInProgress;
  const nextProps = workInProgress.pendingProps;
  let nextChildren = nextProps.children;
  //console.log(nextChildren)
  // 文本节点 且只有一个子节点
  const isDirectTextChild = shouldSetTextContent(type, nextProps);
  if (isDirectTextChild) {
    nextChildren = null;
  }
  reconcileChildren(current, workInProgress, nextChildren);
  return workInProgress.child;
}

/**
 *
 * @param {*} current
 * @param {*} workInProgress
 * @returns
 */
export function beginWork(current, workInProgress) {
  //console.log('first')

  logger(" ".repeat(indent.number) + "beginWork", workInProgress);
  indent.number += 2;
  //return null;
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(current, workInProgress);
    case HostComponent:
      return updateHostComponent(current, workInProgress);
    case HostText:
      return null;
    default:
      return null;
  }
}
