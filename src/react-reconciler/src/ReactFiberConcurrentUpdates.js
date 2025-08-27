// 处理更新优先级 问题
import { HostRoot } from "./ReactWorkTags";
export function markUpdateLaneFromFiberToRoot(sourceFiber) {
  let node = sourceFiber; // 当前fiber
  let parent = sourceFiber.return; // 当前fiber父fiber

  while (parent != null) {
    node = parent;
    parent = parent.return;
  }
  // 一直找到parent为null
  if (node.tag === HostRoot) {
    return node.stateNode; // FiberRootNode
  }

  return null;
}
