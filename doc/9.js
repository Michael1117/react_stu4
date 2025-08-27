// 1. 把虚拟DOM构成fiber树
let A1 = { type: "div", props: { id: "A1" } };
let B1 = { type: "div", props: { id: "B1" }, return: A1 };
let B2 = { type: "div", props: { id: "B2" }, return: A1 };
let C1 = { type: "div", props: { id: "C1" }, return: B1 };
let C2 = { type: "div", props: { id: "C2" }, return: B1 };

A1.child = B1;
B1.sibling = B2;
B1.child = C1;
C1.sibling = C2;

// 下一个工作单元
let nextUnitOfWork = null;
const hasRemainingTime = () => true;
function workLoop() {
  while (nextUnitOfWork && hasRemainingTime()) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  console.log("render阶段结束");
}

function performUnitOfWork(fiber) {
  let child = beginWork(fiber);
  if (child) {
    return child;
  }
  while (fiber) {
    completeUnitOfWork(fiber);
    if (fiber.sibling) {
      return fiber.sibling;
    }
    fiber = fiber.return;
  }
}

function beginWork(fiber) {
  console.log("beginWork", fiber.props.id);
  return fiber.child;
}

function completeUnitOfWork(fiber) {
  console.log("completeUnitOfWork", fiber.props.id);
}

nextUnitOfWork = A1;
workLoop();
