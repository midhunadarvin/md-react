import {
  getNextUnitOfWork,
  getWipRoot,
  setNextUnitOfWork,
  setWipRoot,
} from "./context";
import { FibreNode } from "./interface";
import { createDom } from "./utils";

interface Deadline {
  timeRemaining: () => number;
}

export function workLoop(deadline: Deadline) {
  let shouldYield = false;
  const nextUnitOfWork = getNextUnitOfWork();
  while (nextUnitOfWork && !shouldYield) {
    setNextUnitOfWork(performUnitOfWork(nextUnitOfWork));
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && getWipRoot()) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function performUnitOfWork(fiber: FibreNode) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  // if (fiber.parent) {
  //   fiber.parent.dom.appendChild(fiber.dom);
  // }

  const elements = fiber.props.children;
  let index = 0;
  let prevSibling = null;

  // Loop through all children and create sibling relationship.
  while (index < elements.length) {
    const element = elements[index];
    const newFiber: FibreNode = {
      type: element.type,
      props: element.props,
      parent: fiber,
      dom: null,
    };

    if (index === 0) {
      // Establish parent relationship for the 1st child
      fiber.child = newFiber;
    } else {
      // Create link from previous sibling to the current node
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
    index++;
  }

  // Return the next unit of work (next fibre node)
  if (fiber.child) {
    // If child exists, go to the child.
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      // If sibling exists, go to the sibling.
      return nextFiber.sibling;
    }
    // else go to parent
    nextFiber = nextFiber.parent;
  }
}

export function commitRoot() {
  // TODO add nodes to dom
  const wipRoot = getWipRoot();
  commitWork(wipRoot.child);
  setWipRoot(null);
}

function commitWork(fiber: FibreNode) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
  domParent.appendChild(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
