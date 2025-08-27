import { createFiberRoot } from "./ReactFiberRoot";
import { createUpdate, enqueueUpdate } from "./ReactFiberClassUpdateQueue";
import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";
export function createContainer(containerInfo) {
  return createFiberRoot(containerInfo);
}

export function updateContainer(element, container) {
  // 获取当前 的根fiber
  const current = container.current;
  // 创建更新
  const update = createUpdate();

  // 要更新的虚拟DOM
  update.payload = { element };
  // 把此更新对象添加到current这个根Fiber的更新队列上
  let root = enqueueUpdate(current, update);
  // 返回根节点  从当前的fiber一直到根节点
  // 32个赛道，越往右 优先级越高
  //console.log("root:", root);
  scheduleUpdateOnFiber(root);    // fiber调度更新
}
