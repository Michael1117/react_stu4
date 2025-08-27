import { REACT_ELEMENT_TYPE } from "shared/ReactSymbols";
import { createFiberFromElement, createFiberFromText } from "./ReactFiber";
import { Placement } from "./ReactFiberFlags";
import isArray from "shared/isArray";

/**
 *
 * @param {*} shouldTrackSideEffects 是否跟踪副作用
 */
function createChildReconciler(shouldTrackSideEffects) {
  //console.log(shouldTrackSideEffects)
  function reconcileSingleElement(returnFiber, currentFirstFiber, element) {
    // 创建新的fiber节点
    const created = createFiberFromElement(element);
    created.return = returnFiber;
    return created;
  }

  /**
   * 设置副作用
   * @param {*} newFiber
   * @param {*} newIndex
   * @returns
   */
  function placeSingleChild(newFiber, newIndex) {
    // 说明要添加副作用
    if (shouldTrackSideEffects) {
      // 要在最后的提交阶段插入此节点，
      // React渲染分为渲染(创建Fiber树) 和提交(更新真实DOM)两个阶段
      newFiber.flags |= Placement;  // 2
    }
    return newFiber;
  }

  function createChild(returnFiber, newChild) {
    if ((typeof newChild === "string" && newChild !== "") || typeof newChild === "number") {
      const created = createFiberFromText(`${newChild}`);
      created.return = returnFiber;
      return created;
    }
    //console.log(newChild)
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE: {
          const created = createFiberFromElement(newChild);
          created.return = returnFiber;
          return created;
        }
        default:
          break;
      }
    }
    return null;
  }

  function placeChild(newFiber, newIdx) {
    newFiber.index = newIdx;
    if (shouldTrackSideEffects) {
      // 如果一个fiber它的flags上有Placement，说明此节点需要创建真实DOM并且插入到父容器中
      // 如果父fiber节点是初次挂载，shouldTrackSideEffects = false，不需要添加flags
      // 这种情况下会在完成阶段把所有 子节点全部添加到自己身上
      newFiber.flags |= Placement;
    }
  }
  function reconcileChildrenArray(returnFiber, currentFirstFiber, newChildren) {
    let resultingFirstChild = null; // 返回的第一个子节点
    let previousNewFiber = null; // 上一个新fiber
    let newIdx = 0;
    for (; newIdx < newChildren.length; newIdx++) {
      const newFiber = createChild(returnFiber, newChildren[newIdx]);
      if (newFiber === null) continue;
      placeChild(newFiber, newIdx);
      // 如果previousNewFiber为null, 说明这是第一个fiber
      if (previousNewFiber === null) {
        resultingFirstChild = newFiber; // 这个newFiber就是大儿子
      } else {
        // 否则说明不是大儿子，就把这个newFiber添加到上一个子节点后面
        previousNewFiber.sibling = newFiber;
      }
      previousNewFiber = newFiber;
    }
    return resultingFirstChild;
  }
  /**
   *
   * @param {*} returnFiber 新的父fiber
   * @param {*} currentFirstFiber 老fiber第一个fiber
   * @param {*} newChild 新的子虚拟DOM
   * @returns
   */
  function reconcileChildFibers(returnFiber, currentFirstFiber, newChild) {
    if (typeof newChild === "object" && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstFiber, newChild));
        default:
          break;
      }
    }
    //console.log(newChild)
    // newChild [hello文本节点, span虚拟DOM元素]
    if (isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstFiber, newChild);
    }
    return null;
  }
  return reconcileChildFibers;
}

// 有老fiber 更新的时候用这个
export const mountChildFibers = createChildReconciler(false); // 不跟踪
// 没有老fiber  初次挂载用这个
export const reconcileChildFibers = createChildReconciler(true); // 跟踪
