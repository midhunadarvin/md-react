import {
  getDeletions,
  getNextUnitOfWork,
  getWipRoot,
  setCurrentWipRoot,
  setNextUnitOfWork,
  setWipRoot,
} from "./context";
import { FibreNode } from "./interface";
import { reconcileChildren } from "./reconciliation";
import { createDom, updateDom } from "./utils";

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

  // If there are no more units of work to be done. We can commit our changes (work in progress root) to the DOM.
  if (!nextUnitOfWork && getWipRoot()) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function performUnitOfWork(fiber: FibreNode) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  const elements = fiber.props.children;
  reconcileChildren(fiber, elements);

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
  getDeletions().forEach(commitWork);

  // Get the current work in progress root
  const wipRoot = getWipRoot();
  // Commit the changes to the DOM.
  commitWork(wipRoot.child);

  // Save the current work in progress root, so that it can be serve as a
  // referrence to compare the changes between state updates.
  setCurrentWipRoot(wipRoot);

  // Make the work in progress root to be null, to be reused in the next cycle.
  setWipRoot(null);
}

function commitWork(fiber: FibreNode) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    domParent.removeChild(fiber.dom);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
