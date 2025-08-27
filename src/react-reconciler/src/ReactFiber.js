import { HostRoot, HostComponent, IndeterminateComponent, HostText } from "./ReactWorkTags";
import { NoFlags } from "./ReactFiberFlags";
/**
 *
 * @param {*} tag
 * @param {*} pendingProps 等待处理或者生效的属性
 * @param {*} key 唯一的标识
 * @returns
 */

export function FiberNode(tag, pendingProps, key) {
  this.tag = tag;
  this.pendingProps = pendingProps;
  this.key = key;
  // Fiber树中的节点对应的真实DOM节点
  this.stateNode = null;
  this.return = null; // 指向父节点
  this.child = null; // 指向第一个子节点
  this.sibling = null; // 指向兄弟节点
  // fiber哪里来的？ 通过虚拟DOM节点创建，虚拟DOM会提供pendingProps用来创建fiber节点的属性
  this.memoizedProps = null; // 已经生效的属性

  // 每个fiber还会有自己的状态，每一种fiber 状态存在的类型是不一样的
  // 类组件对应的fiber 存在的就是类的实例的状态，HostRoot存的就是要渲染的元素
  this.memoizedState = null;
  // 每个fiber身上可能还有更新队列
  this.updateQueue = null;
  // 副作用标识，表示要针对此fiber节点进行何种操作
  this.flags = NoFlags;
  // 子节点对应的副作用标识
  this.subtreeFlags = NoFlags;
  this.alternate = null; // 双缓冲池
  this.index = 0;
}

export function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key);
}
export function createHostRootFiber() {
  return createFiber(HostRoot, null, null);
}

/**
 * 基于老的fiber和新的属性创建新的fiber
 * @param {*} current 老fiber
 * @param {*} pendingProps 新属性
 */
export function createWorkInProgress(current, pendingProps) {
  // createWorkInProgress(root.current, null);
  //console.log(current)
  //console.log(current.alternate)
  let workInProgress = current.alternate; // 双缓冲池
  //console.log(workInProgress)
  if (workInProgress === null) {
    // 如果双缓冲池没有值，就创建一个新的
    workInProgress = createFiber(current.tag, pendingProps, current.key);
    workInProgress.type = current.type;
    workInProgress.stateNode = current.stateNode;
    workInProgress.alternate = current;
    current.alternate = workInProgress;
  } else {
    workInProgress.pendingProps = pendingProps;
    workInProgress.type = current.type;
    workInProgress.flags = NoFlags;
    workInProgress.subtreeFlags = NoFlags;
  }
  workInProgress.child = current.child;
  workInProgress.memoizedProps = current.memoizedProps;
  workInProgress.memoizedState = current.memoizedState;
  workInProgress.updateQueue = current.updateQueue;
  workInProgress.sibling = current.sibling;
  workInProgress.index = current.index;
  // console.log(typeof workInProgress.alternate);
  // console.log(typeof current.alternate);
  //console.log(workInProgress);
  //console.log(workInProgress.stateNode.containerInfo);
  return workInProgress;
}

export function createFiberFromElement(element) {
  const { type, key } = element;
  //console.log(element);
  const pendingProps = element.props;
  //console.log(pendingProps)
  return createFiberFromTypeAndProps(type, key, pendingProps);
}

export function createFiberFromText(content) {
  return createFiber(HostText, content, null);
}

function createFiberFromTypeAndProps(type, key, pendingProps) {
  let tag = IndeterminateComponent; // 未定类型
  // 如果类型type是一个字符串 span/div  此Fiber类型是一个原生组件
  if (typeof type === "string") {
    tag = HostComponent;
  }
  const fiber = createFiber(tag, pendingProps, key);
  fiber.type = type;
  return fiber;
}
